import { spawnSync } from 'node:child_process';

const architectures =
  process.env.MUSIC_LIBRARY_ANDROID_ARCHITECTURES || 'arm64-v8a';
const versionName = process.env.MUSIC_LIBRARY_EXAMPLE_VERSION_NAME;
const versionCode = process.env.MUSIC_LIBRARY_EXAMPLE_VERSION_CODE;

if (!/^[a-z0-9_,.-]+$/i.test(architectures)) {
  throw new Error(`Invalid Android architectures: ${architectures}`);
}

if (versionName && !/^[0-9A-Za-z.+-]+$/.test(versionName)) {
  throw new Error(`Invalid Android version name: ${versionName}`);
}

if (versionCode && !/^[1-9][0-9]*$/.test(versionCode)) {
  throw new Error(`Invalid Android version code: ${versionCode}`);
}

const gradleParameters = [
  '--no-daemon',
  '--console=plain',
  `-PreactNativeArchitectures=${architectures}`,
];

if (versionName) {
  gradleParameters.push(`-PmusicLibraryExampleVersionName=${versionName}`);
}

if (versionCode) {
  gradleParameters.push(`-PmusicLibraryExampleVersionCode=${versionCode}`);
}

const yarnCommand = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
const result = spawnSync(
  yarnCommand,
  [
    'react-native',
    'build-android',
    '--tasks',
    'assembleRelease',
    '--extra-params',
    gradleParameters.join(' '),
  ],
  { stdio: 'inherit' }
);

if (result.error) {
  throw result.error;
}

process.exit(result.status === null ? 1 : result.status);
