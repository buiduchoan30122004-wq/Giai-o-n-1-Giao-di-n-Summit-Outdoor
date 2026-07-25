/**
 * Facebook Graph API publishing helper for Summit Outdoor Fanpage
 */
export async function publishToFacebook(
  content: string,
  imageUrl?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !pageAccessToken) {
    const errorMsg = 'FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN is not defined in environment variables.';
    console.warn(errorMsg);
    return { success: false, error: errorMsg };
  }

  try {
    let url = '';
    const formData = new URLSearchParams();
    formData.append('access_token', pageAccessToken);

    if (imageUrl && imageUrl.trim()) {
      // Đăng bài kèm ảnh
      url = `https://graph.facebook.com/v19.0/${pageId}/photos`;
      formData.append('url', imageUrl.trim());
      formData.append('caption', content);
    } else {
      // Đăng bài viết dạng text thông thường
      url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
      formData.append('message', content);
    }

    console.log(`Publishing to Facebook Page ${pageId}...`);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Facebook Graph API response error:', data);
      return { success: false, error: data.error?.message || JSON.stringify(data) };
    }

    // Đối với /photos, FB trả về { id: 'photo_id', post_id: 'post_id' }
    // Đối với /feed, FB trả về { id: 'post_id' }
    const postId = data.post_id || data.id;
    console.log(`Successfully published to Facebook! Post ID: ${postId}`);
    return { success: true, id: postId };

  } catch (err: any) {
    console.error('Error publishing to Facebook Graph API:', err);
    return { success: false, error: err.message || 'Internal connection error to Facebook API' };
  }
}
