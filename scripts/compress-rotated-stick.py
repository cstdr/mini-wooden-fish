#!/usr/bin/env python3
"""
木棍透明图片压缩脚本
"""

from PIL import Image
import os

def compress_rotated_stick(input_path, output_path):
    """
    压缩处理过的木棍图片
    """
    print(f"📖 读取图片: {input_path}")
    
    try:
        img = Image.open(input_path)
        print(f"✅ 图片打开成功")
        print(f"📐 尺寸: {img.size}")
        print(f"🎨 模式: {img.mode}")
        print(f"📊 原始大小: {os.path.getsize(input_path) / 1024:.2f} KB")
        
        # 目标尺寸：256px
        max_size = 256
        width, height = img.size
        
        if width > max_size or height > max_size:
            ratio = min(max_size / width, max_size / height)
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            
            print(f"📐 调整尺寸: {width}x{height} → {new_width}x{new_height}")
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 保存
        print(f"💾 保存为PNG...")
        img.save(output_path, 'PNG', optimize=True)
        
        # 检查文件大小
        compressed_size = os.path.getsize(output_path) / 1024
        original_size = os.path.getsize(input_path) / 1024
        reduction = (1 - compressed_size / original_size) * 100
        
        print(f"\n✅ 压缩完成！")
        print(f"📊 原始大小: {original_size:.2f} KB")
        print(f"📊 压缩后大小: {compressed_size:.2f} KB")
        print(f"📊 压缩率: {reduction:.1f}%")
        
        # 如果还是太大
        if compressed_size > 100:
            print(f"\n⚠️ 进一步压缩...")
            img = img.resize((img.width // 2, img.height // 2), Image.Resampling.LANCZOS)
            img.save(output_path, 'PNG', optimize=True)
            compressed_size = os.path.getsize(output_path) / 1024
            print(f"📊 最终大小: {compressed_size:.2f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, "../images/wooden-transparent-rotated.png")
    output_path = os.path.join(script_dir, "../images/wooden-stick-final.png")
    
    print("=" * 60)
    print("🪵 木棍透明图片压缩")
    print("=" * 60)
    
    if os.path.exists(input_path):
        success = compress_rotated_stick(input_path, output_path)
        if success:
            print("\n🎉 完成！")
    else:
        print(f"❌ 文件不存在")
