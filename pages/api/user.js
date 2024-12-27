import { get } from '@vercel/edge-config';
import path from 'path';
import fs from 'fs';
import JSON from 'json5';
// 获取global的userAnswers数组
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    // get方法
    if (req.method === 'GET') {
        const filePath = path.join(process.cwd(), 'data', 'user.json');
        if (fs.existsSync(filePath)) {
            // 获取user.json文件内容
            let answers = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (!Array.isArray(answers)) {
                answers = [];
            }
            return res.status(200).json(answers);

        } else {
            return res.status(200).json([]);
        }
    }
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}