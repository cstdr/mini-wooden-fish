#!/usr/bin/env python3
"""
微信小程序图片优化脚本
功能：生成适合微信小程序的优化图片
"""

from PIL import Image
import os

def optimize_for_miniprogram(input_path, output_path):
    """
    优化图片以适应微信小程序
    目标：文件大小 < 200KB，分辨率 512x512
    """
    print(f"📖 读取图片: {input_path}")
    
    try:
        # 打开图片
        img = Image.open(input_path)
        print(f"✅ 图片打开成功")
        print(f"📐 原始尺寸: {img.size}")
        print(f"🎨 模式: {img.mode}")
        print(f"📊 原始大小: {os.path.getsize(input_path) / 1024:.2f} KB")
        
        # 目标尺寸：微信小程序推荐的最大边 512px
        max_size = 512
        width, height = img.size
        
        # 计算缩放比例
        if width > max_size or height > max_size:
            ratio = min(max_size / width, max_size / height)
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            
            print(f"📐 调整尺寸: {width}x{height} → {new_width}x{new_height}")
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # 优化保存设置
        print(f"💾 优化保存...")
        img.save(output_path, 'PNG', optimize=True)
        
        # 检查文件大小
        compressed_size = os.path.getsize(output_path) / 1024
        original_size = os.path.getsize(input_path) / 1024
        reduction = (1 - compressed_size / original_size) * 100
        
        print(f"\n✅ 优化完成！")
        print(f"📊 原始大小: {original_size:.2f} KB")
        print(f"📊 优化后大小: {compressed_size:.2f} KB")
        print(f"📊 压缩率: {reduction:.1f}%")
        
        # 如果还是太大，继续压缩
        if compressed_size > 200:
            print(f"\n⚠️ 文件仍然较大({compressed_size:.2f} KB > 200 KB)，进一步压缩...")
            
            # 继续减小尺寸
            img = img.resize((img.width // 2, img.height // 2), Image.Resampling.LANCZOS)
            print(f"📐 再次调整尺寸: → {img.width}x{img.height}")
            
            img.save(output_path, 'PNG', optimize=True)
            compressed_size = os.path.getsize(output_path) / 1024
            reduction = (1 - compressed_size / original_size) * 100
            
            print(f"\n✅ 最终优化完成！")
            print(f"📊 最终大小: {compressed_size:.2f} KB")
            print(f"📊 总压缩率: {reduction:.1f}%")
        
        return True
        
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # 路径设置
    input_file = "../images/wooden-fish-transparent.png"
    output_file = "../images/wooden-fish-mini.png"
    
    # 转换路径为绝对路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, input_file)
    output_path = os.path.join(script_dir, output_file)
    
    print("=" * 60)
    print("🎯 微信小程序图片优化工具")
    print("=" * 60)
    
    if os.path.exists(input_path):
        success = optimize_for_miniprogram(input_path, output_path)
        if success:
            print("\n🎉 成功！已生成适合微信小程序的图片")
            print(f"📁 输出文件: {output_path}")
        else:
            print("\n😢 优化失败")
    else:
        print(f"❌ 文件不存在: {input_path}")
