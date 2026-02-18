import whisper
import sys
import json
import os

sys.stdout.reconfigure(encoding='utf-8')
def transcribe(audio_path,lang):
    ffmpeg_path= 'C:\\ffmpeg\\bin'
    if not os.path.exists(ffmpeg_path):
        raise FileNotFoundError(f"FFmpeg no encontrado en {ffmpeg_path}")
    
    ffmpeg_dir = 'C:\\ffmpeg\\bin'
    os.environ['PATH'] = ffmpeg_dir + os.pathsep + os.environ['PATH']
    model= whisper.load_model('large')
    result= model.transcribe(audio_path,
        language=lang,
        temperature=0,
        verbose=True,
        beam_size=5,
        patience=0.5
    )
    return result

if __name__ == "__main__":
    audio_path= sys.argv[1]
    language=sys.argv[2]
    result= transcribe(audio_path, lang=language)
    print(json.dumps(result, ensure_ascii=False))
