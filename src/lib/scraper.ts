/**
 * Lightweight web scraper helper to extract clean text from competitor websites or articles
 */
export async function scrapeUrlText(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Lấy nội dung bên trong thẻ body nếu có
    let bodyHtml = html;
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      bodyHtml = bodyMatch[1];
    }

    // Loại bỏ các thẻ script, style, head, và comments
    bodyHtml = bodyHtml.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
    bodyHtml = bodyHtml.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '');
    bodyHtml = bodyHtml.replace(/<head[^>]*>([\s\S]*?)<\/head>/gi, '');
    bodyHtml = bodyHtml.replace(/<!--([\s\S]*?)-->/g, '');

    // Loại bỏ tất cả các thẻ HTML khác
    let text = bodyHtml.replace(/<[^>]+>/g, ' ');

    // Làm sạch khoảng trắng thừa và xuống dòng
    text = text.replace(/[\t ]+/g, ' ');
    text = text.replace(/\r?\n\s*\r?\n/g, '\n');
    text = text.trim();

    // Giải mã các thực thể HTML cơ bản
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"');

    // Giới hạn độ dài văn bản gửi đi cho Gemini (khoảng 8000 ký tự đầu tiên để tránh tràn ngữ cảnh)
    return text.substring(0, 8000);
  } catch (err: any) {
    console.error(`Failed to scrape URL ${url}:`, err);
    throw err;
  }
}
