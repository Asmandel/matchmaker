import { z } from 'zod';

export const YoutubeChannelSchema = z.object({
  description: z.string(),
  videos: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

export type YoutubeVideo = z.infer<typeof YoutubeChannelSchema>['videos'][number];
export type YoutubeChannelData = z.infer<typeof YoutubeChannelSchema>;
