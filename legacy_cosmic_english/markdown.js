/**
 * Markdown Parser Module for Cosmic English AI
 */

function parseMarkdown(text) {
    if (!text) return "";

    // Escape basic HTML to prevent tags injection while maintaining safety
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Code Blocks: ```code```
    html = html.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');

    // Headers: ###, ##, #
    html = html.replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.*?)$/gm, '<h1>$1</h1>');

    // Bold text: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic text: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Unordered List Items: - or *
    html = html.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/^\s*\*\s+(.*?)$/gm, '<li>$1</li>');

    // Group adjacent list items into <ul>
    html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

    // Line breaks to <br> for regular newlines, but preserve around layout containers
    let paragraphs = html.split(/\n{2,}/);
    paragraphs = paragraphs.map(p => {
        p = p.trim();
        // If it starts with formatting tags (h1, h2, h3, ul, pre), render directly
        if (/^<(h[1-3]|ul|pre|code)/.test(p)) {
            return p;
        }
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    });

    return paragraphs.join('\n');
}

// Export for Node testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseMarkdown };
}
