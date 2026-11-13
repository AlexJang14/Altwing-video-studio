import {Config} from '@remotion/cli/config';
Config.setVideoImageFormat('jpeg');
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setCodec('h264');
Config.setCrf(18);
Config.setConcurrency(2);
Config.setChromiumOpenGlRenderer('swangle');
Config.setBrowserExecutable('/usr/bin/chromium');
