import { useState } from 'react';
import { Sparkles, Send, Copy, Check, RefreshCw, BookOpen, Target, Zap } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { apiKeyService } from '../services/apiKeyService';
import './AIWriter.css';

const TASK_TYPES = [
    { id: 'task1', label: 'Task 1 - Academic', description: 'Describe charts, graphs, diagrams' },
    { id: 'task2', label: 'Task 2 - Essay', description: 'Opinion, Discussion, Problem-Solution' },
];

const LEVEL_DESCRIPTIONS = {
    A2: 'Beginner - Simple vocabulary, basic sentences',
    B1: 'Intermediate - Common vocabulary, some complex sentences',
    B2: 'Upper-Intermediate - Good vocabulary range, varied structures',
    C1: 'Advanced - Sophisticated vocabulary, complex arguments',
    C2: 'Proficient - Native-like fluency and precision',
    NATIVE: 'Band 9 - Perfect grammar, idiomatic expressions',
};

const BAND_SCORES = {
    A2: '4.0 - 4.5',
    B1: '5.0 - 5.5',
    B2: '6.0 - 6.5',
    C1: '7.0 - 7.5',
    C2: '8.0 - 8.5',
    NATIVE: '9.0',
};

const AIWriter = () => {
    const [topic, setTopic] = useState('');
    const [taskType, setTaskType] = useState('task2');
    const [generatedEssay, setGeneratedEssay] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // Get current level from localStorage
    const currentLevel = localStorage.getItem('user_level') || 'B1';

    const generateEssay = async () => {
        if (!topic.trim()) {
            setError('Vui lòng nhập topic/đề bài');
            return;
        }

        if (!apiKeyService.hasApiKey()) {
            setError('Vui lòng cấu hình API Key trước');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedEssay('');

        const prompt = buildPrompt(topic, taskType, currentLevel);

        try {
            const result = await geminiService.callWithRetry(prompt);

            if (result.success) {
                setGeneratedEssay(result.data);
            } else {
                setError('Không thể tạo bài viết. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error('Essay generation error:', err);
            setError(err.message || 'Có lỗi xảy ra khi tạo bài viết');
        } finally {
            setIsLoading(false);
        }
    };

    const buildPrompt = (topic, taskType, level) => {
        const bandScore = BAND_SCORES[level] || '6.0';
        const levelDesc = LEVEL_DESCRIPTIONS[level] || 'Intermediate';

        const taskInstructions = taskType === 'task1'
            ? `Write an IELTS Academic Task 1 response (minimum 150 words) describing the given data/chart/diagram.`
            : `Write an IELTS Task 2 essay (minimum 250 words) with clear introduction, body paragraphs, and conclusion.`;

        return `You are an IELTS Writing expert. Write a model answer for the following topic.

**Target Band Score:** ${bandScore}
**Level Description:** ${levelDesc}

**Task Type:** IELTS ${taskType === 'task1' ? 'Academic Task 1' : 'Task 2 Essay'}
${taskInstructions}

**Topic/Question:**
${topic}

**Requirements:**
1. Write at the ${level} level (${levelDesc})
2. Use vocabulary and grammar appropriate for Band ${bandScore}
3. Follow proper IELTS essay structure
4. Include clear topic sentences and supporting examples
5. Use appropriate linking words and cohesive devices
6. ${taskType === 'task1' ? 'Describe key features and make comparisons' : 'Present a clear position with well-developed arguments'}

**Format your response as:**
---
**Model Answer (Target Band: ${bandScore})**

[Your essay here]

---
**Word Count:** [number]

**Key Vocabulary Used:**
- [list 5-8 key vocabulary items with brief explanations]

**Structure Overview:**
- Introduction: [brief description]
- Body: [brief description]
- Conclusion: [brief description]
---`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedEssay);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setTopic('');
        setGeneratedEssay('');
        setError('');
    };

    return (
        <div className="ai-writer-page">
            <div className="ai-writer-container">
                {/* Header */}
                <div className="writer-header">
                    <div className="header-icon">
                        <Sparkles size={28} />
                    </div>
                    <h1>AI Viết Theo Topic</h1>
                    <p>Nhập đề bài và AI sẽ viết bài mẫu theo level của bạn</p>
                </div>

                {/* Current Level Display */}
                <div className="level-display">
                    <div className="level-badge">
                        <Target size={16} />
                        <span>Level: <strong>{currentLevel}</strong></span>
                    </div>
                    <div className="band-badge">
                        <Zap size={16} />
                        <span>Target Band: <strong>{BAND_SCORES[currentLevel]}</strong></span>
                    </div>
                </div>

                {/* Task Type Selector */}
                <div className="task-type-selector">
                    <label>Loại bài:</label>
                    <div className="task-buttons">
                        {TASK_TYPES.map((task) => (
                            <button
                                key={task.id}
                                className={`task-btn ${taskType === task.id ? 'active' : ''}`}
                                onClick={() => setTaskType(task.id)}
                            >
                                <span className="task-label">{task.label}</span>
                                <span className="task-desc">{task.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Topic Input */}
                <div className="topic-input-section">
                    <label>
                        <BookOpen size={16} />
                        Nhập Topic / Đề bài:
                    </label>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={taskType === 'task1'
                            ? 'Ví dụ: The chart below shows the percentage of households with internet access in three European countries from 2000 to 2020.'
                            : 'Ví dụ: Some people believe that university students should pay for their own education, while others think the government should fund higher education. Discuss both views and give your opinion.'
                        }
                        rows={4}
                        disabled={isLoading}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="generate-btn btn-primary"
                        onClick={generateEssay}
                        disabled={isLoading || !topic.trim()}
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw size={18} className="spin" />
                                Đang viết...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Viết bài mẫu
                            </>
                        )}
                    </button>
                    {(topic || generatedEssay) && (
                        <button className="clear-btn btn-secondary" onClick={handleClear}>
                            Xóa
                        </button>
                    )}
                </div>

                {/* Generated Essay */}
                {generatedEssay && (
                    <div className="essay-result">
                        <div className="result-header">
                            <h3>
                                <Sparkles size={18} />
                                Bài Viết Mẫu
                            </h3>
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Đã copy!' : 'Copy'}
                            </button>
                        </div>
                        <div className="essay-content">
                            <pre>{generatedEssay}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIWriter;
