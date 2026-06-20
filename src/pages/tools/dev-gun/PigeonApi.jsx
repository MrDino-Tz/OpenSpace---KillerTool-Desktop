import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Chip
} from '@mui/material';
import MainCard from 'components/MainCard';
import { fetch } from '@tauri-apps/plugin-http';

const PigeonApi = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!url) return;
    setLoading(true);
    setResponse(null);
    try {
      let parsedHeaders = {};
      if (headers.trim()) {
        const lines = headers.split('\n');
        lines.forEach(line => {
          const [key, ...val] = line.split(':');
          if (key && val.length) {
            parsedHeaders[key.trim()] = val.join(':').trim();
          }
        });
      }

      const options = {
        method,
        headers: parsedHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        options.body = body;
      }

      const startTime = performance.now();
      const res = await fetch(url, options);
      const endTime = performance.now();

      const text = await res.text();
      let formattedData = text;
      try {
        formattedData = JSON.stringify(JSON.parse(text), null, 2);
      } catch (e) {
        // Not JSON
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time: Math.round(endTime - startTime),
        data: formattedData
      });
    } catch (err) {
      setResponse({
        status: 'Error',
        statusText: err.message,
        time: 0,
        data: ''
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="Pigeon API (Dev Gun)">
      <Typography variant="body2" color="textSecondary" mb={3}>
        Native API testing client. Bypasses browser CORS restrictions by executing requests directly from the local Rust backend.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" gap={1}>
            <Select value={method} onChange={(e) => setMethod(e.target.value)} size="small" sx={{ minWidth: 100 }}>
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="PATCH">PATCH</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
            <TextField
              fullWidth
              size="small"
              placeholder="https://api.example.com/v1/users"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button variant="contained" color="primary" onClick={handleSend} disabled={loading || !url}>
              {loading ? <CircularProgress size={24} /> : 'Send'}
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>Headers (Key: Value)</Typography>
          <TextField
            multiline
            rows={5}
            fullWidth
            placeholder={"Authorization: Bearer token123\nContent-Type: application/json"}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>Body</Typography>
          <TextField
            multiline
            rows={5}
            fullWidth
            placeholder={'{\n  "name": "mrdino"\n}'}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={['GET', 'DELETE'].includes(method)}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mt: 1, minHeight: 250, backgroundColor: '#1e1e1e', color: '#d4d4d4', overflowX: 'auto' }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">Response</Typography>
              {response && (
                <Box display="flex" gap={1}>
                  <Chip 
                    label={`${response.status} ${response.statusText || ''}`} 
                    color={response.status >= 200 && response.status < 300 ? 'success' : 'error'} 
                    size="small" 
                  />
                  <Chip label={`${response.time} ms`} size="small" sx={{ backgroundColor: '#333', color: '#fff' }} />
                </Box>
              )}
            </Box>
            {response ? (
              <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {response.data}
              </pre>
            ) : (
              <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
                Enter a URL and hit Send to see the response here.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default PigeonApi;
