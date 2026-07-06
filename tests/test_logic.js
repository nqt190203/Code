const assert = require('assert');
const { parseMarkdown } = require('../app.js');

console.log('🧪 Starting Cosmic English AI Unit Tests...');
let passed = 0;
let failed = 0;

const tests = [
    {
        name: 'Header parsing',
        fn: () => {
            const input = '# Heading 1\n## Heading 2\n### Heading 3';
            const expected = '<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<h3>Heading 3</h3>';
            assert.strictEqual(parseMarkdown(input), expected);
        }
    },
    {
        name: 'Bold & Italic parsing',
        fn: () => {
            const input = 'This is **bold** and *italic* text.';
            const expected = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>';
            assert.strictEqual(parseMarkdown(input), expected);
        }
    },
    {
        name: 'List items parsing',
        fn: () => {
            const input = '- Item A\n- Item B';
            const expected = '<ul><li>Item A</li></ul>\n<ul><li>Item B</li></ul>';
            assert.strictEqual(parseMarkdown(input), expected);
        }
    },
    {
        name: 'Code block parsing',
        fn: () => {
            const input = '```\nconst x = 5;\nconsole.log(x);\n```';
            const expected = '<pre><code>\nconst x = 5;\nconsole.log(x);\n</code></pre>';
            assert.strictEqual(parseMarkdown(input), expected);
        }
    },
    {
        name: 'HTML sanitization',
        fn: () => {
            const input = '<script>alert("XSS")</script>';
            const expected = '<p>&lt;script&gt;alert("XSS")&lt;/script&gt;</p>';
            assert.strictEqual(parseMarkdown(input), expected);
        }
    }
];

tests.forEach(test => {
    try {
        test.fn();
        console.log(`✅ Passed: ${test.name}`);
        passed++;
    } catch (err) {
        console.error(`❌ Failed: ${test.name}`);
        console.error(err);
        failed++;
    }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
