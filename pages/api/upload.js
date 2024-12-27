// api/upload.js

import COS from 'cos-nodejs-sdk-v5';
import formidable from 'formidable';
import fs from 'fs';

// 初始化 COS 客户端
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

// 禁用 Next.js 默认的 body 解析器，因为我们使用 formidable 处理文件上传
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
    // 设置 CORS 头部
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('解析文件时出错:', err);
      return res.status(500).json({ message: '解析文件时出错' });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ message: '未上传文件' });
    }

    // 验证文件类型
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
      return res.status(400).json({ message: '不支持的文件类型' });
    }

    // 验证文件大小（例如最大5MB）
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return res.status(400).json({ message: '文件过大，最大支持5MB' });
    }

    // 读取文件内容
    let fileContent;
    try {
      fileContent = fs.readFileSync(file.filepath);
    } catch (readErr) {
      console.error('读取文件时出错:', readErr);
      return res.status(500).json({ message: '读取文件时出错' });
    }

    // 生成唯一文件名
    const fileName = `${Date.now()}_${file.originalFilename}`;

    const params = {
      Bucket: process.env.COS_BUCKET, // 存储桶名称
      Region: process.env.COS_REGION, // 存储桶所在地域
      Key: fileName, // 文件名
      Body: fileContent, // 文件内容
      ContentType: file.mimetype, // 文件类型
      // ACL: 'public-read', // 如果存储桶为公共读，这行可以启用
    };

    // 上传到 COS
    cos.putObject(params, (uploadErr, data) => {
      if (uploadErr) {
        console.error('上传到 COS 时出错:', uploadErr);
        return res.status(500).json({ message: '上传文件失败' });
      }

      // 构建文件的访问 URL
      // 如果存储桶为公共读，可以直接使用 URL 访问
      // 否则，需要使用 getImage API 获取签名 URL
      const url = `https://${params.Bucket}.cos.${params.Region}.myqcloud.com/${params.Key}`;
      return res.status(200).json({ url });
    });
  });
}