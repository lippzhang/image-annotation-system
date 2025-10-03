import React, { useRef, useEffect, useState, useCallback } from 'react';
import Konva from 'konva';
import { Html } from 'react-konva-utils';

interface TextEditorProps {
  textNode: Konva.Text;
  onTextChange: (newText: string) => void;
  onClose: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ textNode, onTextChange, onClose }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [initialText, setInitialText] = useState('');

  // 初始化文本
  useEffect(() => {
    if (!textNode) return;
    setInitialText(textNode.text());
  }, [textNode]);

  // 处理 textarea 的事件和样式调整
  const handleTextareaRef = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (!textarea || !textNode) return;

    // 自动调整高度
    const adjustHeight = () => {
      if (!textarea) return;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    };

    // 延迟执行，确保 DOM 已经渲染
    setTimeout(() => {
      if (textarea) {
        adjustHeight();
        textarea.focus();
        textarea.select();
      }
    }, 10);

    // 事件处理函数
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation(); // 防止事件冒泡
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onTextChange(textarea.value);
        onClose();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    const handleInput = () => {
      adjustHeight();
    };

    const handleBlur = () => {
      // 延迟执行，避免与其他点击事件冲突
      setTimeout(() => {
        onTextChange(textarea.value);
        onClose();
      }, 100);
    };

    // 添加事件监听器
    textarea.addEventListener('keydown', handleKeyDown);
    textarea.addEventListener('input', handleInput);
    textarea.addEventListener('blur', handleBlur);

    // 返回清理函数
    return () => {
      textarea.removeEventListener('keydown', handleKeyDown);
      textarea.removeEventListener('input', handleInput);
      textarea.removeEventListener('blur', handleBlur);
    };
  }, [textNode, onTextChange, onClose]);

  // 直接使用 handleTextareaRef 作为 ref callback
  const refCallback = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      handleTextareaRef(textarea);
    }
  }, [handleTextareaRef]);

  if (!textNode) return null;

  // 使用 Html 组件，定位到文本节点位置
  return (
    <Html
      groupProps={{ x: textNode.x(), y: textNode.y() }}
      divProps={{
        style: {
          pointerEvents: 'auto',
        }
      }}
    >
      <textarea
        ref={refCallback}
        defaultValue={initialText}
        style={{
          width: `${Math.max(textNode.width(), 200)}px`,
          minHeight: `${textNode.height()}px`,
          fontSize: `${textNode.fontSize()}px`,
          fontFamily: textNode.fontFamily(),
          color: typeof textNode.fill() === 'string' ? textNode.fill() as string : '#333',
          border: '2px solid #1890ff',
          borderRadius: '4px',
          padding: '4px',
          margin: '0px',
          background: 'white',
          outline: 'none',
          resize: 'none',
          lineHeight: textNode.lineHeight() || 1.2,
          boxSizing: 'border-box',
        }}
      />
    </Html>
  );
};

export default TextEditor;