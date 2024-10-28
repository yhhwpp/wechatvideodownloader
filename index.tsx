import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeChatVideoDownloader = ({ maxRetries = 3, timeout = 30000, userAgent = 'WeChatVideoDownloader/1.0' }) => {
  const [downloadStatus, setDownloadStatus] = useState({});
  const [multipleDownloadStatus, setMultipleDownloadStatus] = useState([]);

  const download = async (url, fileName) => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await axios({
          method: 'get',
          url: url,
          responseType: 'blob',
          timeout: timeout,
          headers: { 'User-Agent': userAgent }
        });

        const blob = new Blob([response.data], { type: 'video/mp4' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadStatus({ [url]: 'success' });
        return;
      } catch (error) {
        console.error(`Download failed, retrying (${retries + 1}/${maxRetries})`);
        retries++;
        if (retries === maxRetries) {
          setDownloadStatus({ [url]: 'failed' });
          throw error;
        }
      }
    }
  };

  const downloadMultiple = async (urls) => {
    const downloads = urls.map((url, index) => {
      const fileName = `video_${index + 1}.mp4`;
      return download(url, fileName);
    });

    try {
      await Promise.all(downloads);
      setMultipleDownloadStatus(urls.map(url => ({ url, status: 'success' })));
    } catch (error) {
      console.error('Failed to download multiple videos:', error);
      setMultipleDownloadStatus(urls.map(url => ({ url, status: downloadStatus[url] || 'failed' })));
    }
  };

  return (
    <div>
      <h1>WeChat Video Downloader</h1>
      <h2>Single Video Download</h2>
      <button onClick={() => download('https://example.com/video1.mp4', 'output1.mp4')}>
        Download Single Video
      </button>
      {Object.entries(downloadStatus).map(([url, status]) => (
        <p key={url}>Download status for {url}: {status}</p>
      ))}

      <h2>Multiple Video Download</h2>
      <button onClick={() => downloadMultiple([
        'https://example.com/video1.mp4',
        'https://example.com/video2.mp4',
        'https://example.com/video3.mp4'
      ])}>
        Download Multiple Videos
      </button>
      {multipleDownloadStatus.map(({ url, status }) => (
        <p key={url}>Download status for {url}: {status}</p>
      ))}
    </div>
  );
};

export default WeChatVideoDownloader;

// Add a new component for the WeChat bot integration
const WeChatBotIntegration = () => {
  const [botMessage, setBotMessage] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const sendMessageToBot = async () => {
    try {
      // Simulating a bot response - replace with actual API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve('Video download link: https://example.com/video.mp4'), 1000)
      );
      setBotResponse(response);
    } catch (error) {
      console.error('Error communicating with bot:', error);
      setBotResponse('Failed to get response from bot');
    }
  };

  return (
    <div>
      <h2>WeChat Bot Integration</h2>
      <input
        type="text"
        value={botMessage}
        onChange={(e) => setBotMessage(e.target.value)}
        placeholder="Enter message for WeChat bot"
      />
      <button onClick={sendMessageToBot}>Send to Bot</button>
      {botResponse && <p>Bot Response: {botResponse}</p>}
    </div>
  );
};



