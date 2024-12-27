// pages/api/validateAnswers.js


import { correctAnswers } from './correctAnswer';
import fs from 'fs';
import path from 'path';
import JSON from 'json5';

export default async function handler(req, res) {
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

  const userAnswers = req.body.answers;

//   if (!Array.isArray(userAnswers) || userAnswers.length !== correctAnswers.length) {
//     return res.status(400).json({ message: 'Invalid answers format or length.' });
//   }

  // 存储最后两题到全局变量数组中。
  // 如果数组长度大于10，那么就移除第一个元素，保持数组长度为10
  // 还需要初始化
  // 从edge-config中获取

    const filePath = path.join(process.cwd(), 'data', 'user.json');
    if (fs.existsSync(filePath)) {
        // 获取user.json文件内容
        let answers = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!Array.isArray(answers)) {
            answers = [];
        }
        if (answers.length >= 10) {
            answers.shift();
        }
        answers.push({
            "name": userAnswers[18],
            "avatar": userAnswers[19],
            "default": false
        });
        // 将answers写到/data/user.json中
        fs.writeFileSync(filePath, JSON.stringify(answers));

    }


    



  // 判断9-12题是否全部为null（即index为8-11）
    const isNull = userAnswers.slice(8, 12).every(a => a === null);
    if (isNull) {
        // 返回其他题目1-8和13-18的正确总数
        const results = userAnswers.map((answer, i) => {
            if (i < 8 || (i > 11 && i < 18)) {
                // 如果是数组，需要判断对应选项是否正确
                if (Array.isArray(answer)) {
                    return {
                        correct: correctAnswers[i].every(ca => answer.includes(ca)),
                    };
                }
                else {
                    // 其他情况直接比较答案
                    return {
                        correct: correctAnswers[i] === answer,
                    }
                }
            }
            return {
                correct: false,
            };
        });
        // 返回总数

        // 返回结果
        res.status(200).json({ results });
    } else {
        // 仅返回9-12题的正确数
        const results = userAnswers.slice(8, 12).map((answer, i) => {
            return {
                correct: correctAnswers[i + 8] === answer,
            };
        });
        // 返回结果
        res.status(200).json({ results });
    }

        

  // Determine overall success
//   const allCorrect = results.every(r => r.correct);

  // 不可能进入这个分支，因为前端会根据results判断是否全部正确
  return res.status(200).json({ message: 'Invalid answers format or length.' });
}