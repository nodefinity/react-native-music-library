import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';
import { useEffect, useState, useRef } from 'react';

interface LyricLine {
  time: number;
  text: string;
}

interface LyricsViewProps extends ScrollViewProps {
  lyrics?: string;
  currentTime: number;
  onLyricPress?: (time: number) => void;
}

export default function LyricsView({
  lyrics,
  currentTime,
  onLyricPress,
  style,
  ...props
}: LyricsViewProps) {
  const [parsedLyrics, setParsedLyrics] = useState<LyricLine[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (lyrics) {
      const parsed = parseLyrics(lyrics);
      console.log('parsed', parsed);
      setParsedLyrics(parsed);
      setCurrentLyricIndex(0);
    } else {
      setParsedLyrics([]);
      setCurrentLyricIndex(-1);
    }
  }, [lyrics]);

  useEffect(() => {
    if (parsedLyrics.length === 0) return;

    const findCurrentIndex = (time: number, lines: LyricLine[]) => {
      let low = 0;
      let high = lines.length - 1;
      let mid;
      while (low <= high) {
        mid = Math.floor((low + high) / 2);
        if (lines[mid]!.time < time) {
          low = mid + 1;
        } else if (lines[mid]!.time > time) {
          high = mid - 1;
        } else {
          return mid;
        }
      }
      return Math.max(low - 1, 0);
    };

    const OFFSET = 0.1;
    const currentTimeInSeconds = currentTime / 1000 + OFFSET;
    const currentIndex = findCurrentIndex(currentTimeInSeconds, parsedLyrics);

    if (currentIndex !== currentLyricIndex) {
      setCurrentLyricIndex(currentIndex);
      if (currentIndex >= 0 && scrollViewRef.current) {
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({
            y: currentIndex * 40,
            animated: true,
          });
        });
      }
    }
  }, [currentTime, parsedLyrics, currentLyricIndex]);

  const parseLyrics = (lyricsText: string): LyricLine[] => {
    const lines = lyricsText.split('\n');
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

    const timeMap = new Map<number, string>();

    lines.forEach((line) => {
      const matches = Array.from(line.matchAll(timeRegex));
      if (matches.length > 0) {
        const text = line.replace(timeRegex, '').trim();
        if (text) {
          matches.forEach((match) => {
            const [, min, sec, ms] = match;
            if (min && sec && ms) {
              const time =
                parseInt(min, 10) * 60 +
                parseInt(sec, 10) +
                parseInt(ms, 10) / 1000;
              timeMap.set(time, text);
            }
          });
        }
      }
    });

    return Array.from(timeMap.entries())
      .map(([time, text]) => ({ time, text }))
      .sort((a, b) => a.time - b.time);
  };

  const handleLyricPress = (line: LyricLine) => {
    onLyricPress?.(line.time * 1000);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {parsedLyrics.map((line, index) => (
          <Text
            key={index}
            style={[
              styles.lyricLine,
              index === currentLyricIndex && styles.currentLyricLine,
            ]}
            onPress={() => handleLyricPress(line)}
          >
            {line.text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: '100%',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  lyricLine: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 8,
    height: 40,
  },
  currentLyricLine: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
