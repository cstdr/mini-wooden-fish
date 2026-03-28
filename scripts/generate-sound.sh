#!/bin/bash

# 木鱼功德机 - 音效生成脚本
# 在 macOS 上运行此脚本生成测试音效

cd "$(dirname "$0")/.."

echo "🎵 正在生成敲击音效..."

# 使用 macOS 内置工具生成简单的敲击音
# 方法1: 使用 afplay 和简单音频生成

# 检查是否有 sox
if command -v sox &> /dev/null; then
    echo "使用 sox 生成音效..."
    sox -n audio/knock.mp3 synth 0.1 sin 440 vol 0.8
    echo "✅ 音效生成成功！"
else
    # 方法2: 使用 Python 生成简单的音频
    if command -v python3 &> /dev/null; then
        echo "使用 Python 生成音效..."
        python3 << 'EOF'
import wave
import struct
import math
import os

sample_rate = 44100
duration = 0.15
frequency = 440

output_file = "audio/knock.mp3"

with wave.open("audio/knock.wav", 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    
    num_samples = int(sample_rate * duration)
    
    for i in range(num_samples):
        t = i / sample_rate
        amplitude = 0.5 * math.exp(-t * 30)
        value = amplitude * math.sin(2 * math.pi * frequency * t)
        data = struct.pack('<h', int(value * 32767))
        wav_file.writeframes(data)

print("✅ 音效生成成功！")
print("📝 注意: 生成的为 WAV 格式，请转换为 MP3 格式使用")
print("💡 提示: 可以使用在线工具将 WAV 转换为 MP3")
EOF
    else
        echo "❌ 未找到 Python3，请安装 sox 或 Python3"
        echo "💡 或者手动下载音效文件放入 audio 目录"
        exit 1
    fi
fi

echo ""
echo "🎉 完成！现在可以将音频文件放入微信小程序项目使用"
