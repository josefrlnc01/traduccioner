import whisper
import sys
import json
import os


sys.stdout.reconfigure(encoding='utf-8')

ffmpeg_dir = 'C:\\ffmpeg\\bin'
os.environ['PATH'] = ffmpeg_dir + os.pathsep + os.environ['PATH']
if not os.path.exists(ffmpeg_dir):
        raise FileNotFoundError(f"FFmpeg no encontrado en {ffmpeg_dir}")

model = whisper.load_model('base')


def transcribe(audio_path, lang):
    print(f"Transcribiendo {audio_path}...", file=sys.stderr)
    result = model.transcribe(audio_path, language=lang)
    return result

if __name__ == "__main__":
    audio_path= sys.argv[1]
    language=sys.argv[2]
    result= transcribe(audio_path, lang=language)
    print(json.dumps(result, ensure_ascii=False))
