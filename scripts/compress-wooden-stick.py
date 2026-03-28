#!/usr/bin/env python3
"""
木棍图片压缩脚本
功能：压缩木棍图片到合适大小，保留透明通道
"""

from PIL import Image
import os

def compress_wooden_stick(input_path, output_path):
    """
    压缩木棍图片
    目标：< 100KB，适合作为小装饰
    """
    print(f"📖 读取图片: {input_path}")
    
    try:
        # 打开图片
        img = Image.open(input_path)
        print(f"✅ 图片打开成功")
        print(f"📐 原始尺寸: {img.size}")
        print(f"🎨 模式: {img.mode}")
        print(f"📊 原始大小: {os.path.getsize(input_path) / 1024:.2f} KB")
        
        # 木棍图片的目标尺寸：200-300px 长度比较合适
        # 保持原始宽高比
        max_size = 256
        width, height = img.size
        
        # 计算缩放比例
        if width > max_size or height > max_size:
            ratio = min(max_size / width, max_size / height)
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            
            print(f"📐 调整尺寸: {width}x{height} → {new_width}x{new_height}")
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 确保是 RGBA 模式（保留透明）
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
            print(f"🔄 转换为 RGBA 模式")
        
        # 保存 PNG
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
        print(f"📐 最终尺寸: {img.size}")
        
        # 如果太大，继续压缩
        if compressed_size > 100:
            print(f"\n⚠️ 文件仍然较大({compressed_size:.2f} KB > 100 KB)，进一步压缩...")
            
            # 继续减小尺寸
            img = img.resize((img.width // 2, img.height // 2), Image.Resampling.LANCZOS)
            print(f"📐 再次调整尺寸: → {img.width}x{img.height}")
            
            img.save(output_path, 'PNG', optimize=True)
            compressed_size = os.path.getsize(output_path) / 1024
            
            print(f"\n✅ 最终压缩完成！")
            print(f"📊 最终大小: {compressed_size:.2f} KB")
        
        return True
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # 路径设置
    input_file = "../images/wooden.png"
    output_file = "../images/wooden-mini.png"
    
    # 转换路径为绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, input_file)
    output_path = os.path.join(script_dir, output_file)
    
    print("=" * 60)
    print("🪵 木棍图片压缩工具")
    print("=" * 60)
    
    if os.path.exists(input_path):
        success = compress_wooden_stick(input_path, output_path)
        if success:
            print("\n🎉 成功！已生成木棍小图")
            print(f"📁 输出文件: {output_path}")
        else:
            print("\n😢 压缩失败")
    else:
        print(f"❌ 文件不存在: {input_path}")
