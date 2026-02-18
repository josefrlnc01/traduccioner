
import sys
import json
import os
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding='utf-8')

def transcribe(audio_path,lang):
    ffmpeg_path= 'C:\\ffmpeg\\bin'
    if not os.path.exists(ffmpeg_path):
        raise FileNotFoundError(f"FFmpeg no encontrado en {ffmpeg_path}")
    
    ffmpeg_dir = 'C:\\ffmpeg\\bin'
    os.environ['PATH'] = ffmpeg_dir + os.pathsep + os.environ['PATH']
    model = WhisperModel("medium", device="cpu", compute_type="int8")
    segments, info = model.transcribe(audio_path, language=lang, beam_size=5, vad_filter=True)
    segments_list = list(segments)
    if not segments_list:
        return "No se detectó audio"
    
    result = " ".join([segment.text for segment in segments_list])
    return result

if __name__ == "__main__":
    audio_path= sys.argv[1]
    language=sys.argv[2]
    result= transcribe(audio_path, lang=language)
    print(json.dumps(result, ensure_ascii=False))
