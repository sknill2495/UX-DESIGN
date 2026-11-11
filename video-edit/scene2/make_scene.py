"""Generate the closing Swapnil scene (Veo, silent) + Umbriel voiceover (Gemini TTS) and splice onto out/final.mp4.

Key: read from GEMINI_API_KEY if set; otherwise relies on the environment's network secret
for generativelanguage.googleapis.com (header x-goog-api-key) being injected by the proxy.
Run:  python3 -I scene2/make_scene.py   (from video-edit/)
"""
import base64, json, os, subprocess, sys, time, urllib.request, wave

API = "https://generativelanguage.googleapis.com/v1beta"
KEY = os.environ.get("GEMINI_API_KEY", "")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

VEO_PROMPT = (
    "Vertical 9:16 cinematic shot, 8 seconds, continuation of the same scene. The same young Indian man from the "
    "reference image (identical face, curly black hair, short beard and moustache, teal-blue rectangular glasses, "
    "dark green rugby polo with mustard-yellow and maroon stripes and cream collar) sits on the same grey sofa in the "
    "same warm, softly lit living room at night; the TV behind him is switched off. He is scrolling short videos on "
    "his smartphone held in one hand, face lit by the phone. At about 3 seconds he stops scrolling, slowly turns his "
    "head to look directly into the camera, raises his eyebrows slightly and gives a playful, teasing, mischievous "
    "smile, as if he has caught the viewer doing the same thing, and makes a small casual pointing gesture toward the "
    "camera with his free hand. He holds the knowing smile to the end. His mouth stays closed or in a closed-lip smile: "
    "he does not speak, no lip movement, no talking. Static medium shot, shallow depth of field, warm tungsten lamp "
    "light, natural skin texture, photorealistic. No text, no captions, no logos, no watermark. "
    "Audio: quiet room tone only, no speech, no music."
)
TTS_TEXT = "अरे, तू क्या देख रहा है? तू भी तो ऐसा ही करता है ना?"
TTS_STYLE = ("Say this in a playful, teasing, conversational tone, like a friend catching you red-handed, "
             "with natural Indian Hinglish pronunciation: ")


def req(method, url, body=None):
    h = {"Content-Type": "application/json"}
    if KEY:
        h["x-goog-api-key"] = KEY
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, headers=h, method=method)
    with urllib.request.urlopen(r, timeout=300) as resp:
        return resp.read()


def pick(models, prefix, prefer):
    names = [m["name"].split("/")[-1] for m in models if m["name"].split("/")[-1].startswith(prefix)]
    for p in prefer:
        for n in names:
            if n.startswith(p):
                return n
    return sorted(names)[-1] if names else None


def main():
    models = []
    tok = ""
    while True:
        d = json.loads(req("GET", f"{API}/models?pageSize=1000" + (f"&pageToken={tok}" if tok else "")))
        models += d.get("models", [])
        tok = d.get("nextPageToken")
        if not tok:
            break
    veo = os.environ.get("VEO_MODEL") or pick(models, "veo", ["veo-3.1-generate", "veo-3.1", "veo-3.0-generate", "veo-3"])
    tts = os.environ.get("TTS_MODEL") or pick(models, "gemini", ["gemini-2.5-pro-preview-tts", "gemini-2.5-flash-preview-tts"])
    tts = tts if tts and "tts" in tts else next((m["name"].split("/")[-1] for m in models if "tts" in m["name"]), None)
    print("models:", veo, tts, flush=True)

    # 1) Umbriel voiceover
    wav = os.path.join(OUT, "vo_umbriel.wav")
    if not os.path.exists(wav):
        body = {"contents": [{"parts": [{"text": TTS_STYLE + TTS_TEXT}]}],
                "generationConfig": {"responseModalities": ["AUDIO"],
                                     "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Umbriel"}}}}}
        d = json.loads(req("POST", f"{API}/models/{tts}:generateContent", body))
        pcm = base64.b64decode(d["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
        with wave.open(wav, "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
        print("voiceover saved", flush=True)

    # 2) Veo clip, image-to-video from the last frame of the edit's source shot
    clip = os.path.join(OUT, "scene_raw.mp4")
    if not os.path.exists(clip):
        img = base64.b64encode(open(os.path.join(ROOT, "refs", "swapnil_ref_36.1s.png"), "rb").read()).decode()
        body = {"instances": [{"prompt": VEO_PROMPT, "image": {"bytesBase64Encoded": img, "mimeType": "image/png"}}],
                "parameters": {"aspectRatio": "9:16", "durationSeconds": 8, "personGeneration": "allow_adult"}}
        op = json.loads(req("POST", f"{API}/models/{veo}:predictLongRunning", body))
        name = op["name"]
        print("veo op:", name, flush=True)
        while not op.get("done"):
            time.sleep(15)
            op = json.loads(req("GET", f"{API}/{name}"))
        if "error" in op:
            sys.exit(f"veo error: {op['error']}")
        resp = op["response"]
        samples = resp.get("generateVideoResponse", resp).get("generatedSamples") or resp.get("generatedVideos")
        uri = samples[0]["video"]["uri"]
        open(clip, "wb").write(req("GET", uri))
        print("clip saved", flush=True)

    # 3) Conform clip to 1080x1920@30, drop its audio, lay voiceover from 0.6 s, splice after the edit
    scene = os.path.join(OUT, "scene_final.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", clip, "-i", wav, "-filter_complex",
                    "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p[v];"
                    "[1:a]adelay=600|600,aresample=48000,aformat=channel_layouts=stereo,apad[a]",
                    "-map", "[v]", "-map", "[a]", "-t", "8", "-c:v", "libx264", "-crf", "16", "-c:a", "aac", "-b:a", "256k", scene], check=True)
    joined = os.path.join(ROOT, "out", "final_with_scene.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(ROOT, "out", "final.mp4"), "-i", scene, "-filter_complex",
                    "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a];[a]loudnorm=I=-14:TP=-1:LRA=11[an]",
                    "-map", "[v]", "-map", "[an]", "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p",
                    "-movflags", "+faststart", "-c:a", "aac", "-b:a", "192k", joined], check=True)
    print("done:", joined)


if __name__ == "__main__":
    main()
