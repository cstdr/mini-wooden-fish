#!/usr/bin/env python3
"""
图片压缩脚本
功能：压缩PNG图片到合适的大小
"""

from PIL import Image
import os

def compress_image(input_path, output_path, max_size=(1024, 1024), quality=85):
    """
    压缩图片
    
    参数:
        input_path: 输入文件路径
        output_path: 输出文件路径
        max_size: 最大尺寸（宽度, 高度）
        quality: JPEG质量（1-100）
    """
    print(f"📖 读取图片: {input_path}")
    
    try:
        # 打开图片
        img = Image.open(input_path)
        print(f"✅ 图片打开成功")
        print(f"📐 原始尺寸: {img.size}")
        print(f"🎨 模式: {img.mode}")
        
        # 计算缩放比例
        width, height = img.size
        max_width, max_height = max_size
        
        if width > max_width or height > max_height:
            ratio = min(max_width / width, max_height / height)
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            
            print(f"📐 调整尺寸: {width}x{height} → {new_width}x{new_height}")
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 保存（PNG不需要quality参数）
        if img.mode == 'RGBA':
            print(f"💾 保存为PNG...")
            img.save(output_path, 'PNG', optimize=True)
        else:
            print(f"💾 保存为PNG...")
            img = img.convert('RGBA')
            img.save(output_path, 'PNG', optimize=True)
        
        # 检查文件大小
        original_size = os.path.getsize(input_path) / 1024
        compressed_size = os.path.getsize(output_path) / 1024
        reduction = (1 - compressed_size / original_size) * 100
        
        print(f"✅ 压缩完成！")
        print(f"📊 原始大小: {original_size:.2f} KB")
        print(f"📊 压缩后大小: {compressed_size:.2f} KB")
        print(f"📊 压缩率: {reduction:.1f}%")
        
        return True
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False

if __name__ == "__main__":
    # 路径设置
    input_file = "../images/wooden-fish-transparent.png"
    output_file = "../images/wooden-fish-transparent-compressed.png"
    
    # 转换路径为绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, input_file)
    output_path = os.path.join(script_dir, output_file)
    
    print("=" * 50)
    print("🗜️ 图片压缩工具")
    print("=" * 50)
    
    if os.path.exists(input_path):
        success = compress_image(input_path, output_path, max_size=(1024, 1024))
        if success:
            print("\n🎉 成功！压缩后的图片已生成")
        else:
            print("\n😢 压缩失败")
    else:
        print(f"❌ 文件不存在: {input_path}")
