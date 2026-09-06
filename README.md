# 基金从业考点训练

面向零基础学员的基金从业资格考试（科一+科二，2026大纲）考点学习与刷题 SPA。

## 启动

```bash
cd /workspace/fund-exam-trainer
npm install
npm run dev
```

默认监听 0.0.0.0:5173。

## 构建

```bash
npm run build
npm run preview
```

## 功能

- 首页：先科一再科二；科一/科二/错题本/继续练习；本地进度
- 考点总览：章/节树、掌握/理解/了解徽章、筛选与搜索
- 考点详解：速记 + 练习入口
- 练习：按章/考点/级别/随机；即时反馈；进度条；结算
- 错题本：答错自动收录 localStorage，可重练、移除、清空

## 数据

- src/data/curriculum.json
- src/data/explanations.json
- src/data/questions.json

存储键：fund-exam-progress-v1、fund-exam-wrong-v1
