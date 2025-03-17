import { FormattedMetric } from "@/actions/metrics"

interface ChartDataPoint {
    name: string
    youtube: number
    spotify: number
    deezer: number
    genius: number
    lastfm: number
}

export function transformMetricsToChartData(
    artist1Metrics: FormattedMetric[],
    artist2Metrics: FormattedMetric[],
    artist1Name: string = "Artist 1",
    artist2Name: string = "Artist 2"
): ChartDataPoint[] {
    const createDataPoint = (metrics: FormattedMetric[], name: string): ChartDataPoint => {
        const dataPoint: ChartDataPoint = {
            name,
            youtube: 0,
            spotify: 0,
            deezer: 0,
            genius: 0,
            lastfm: 0
        }

        metrics.forEach(metric => {
            switch (metric.platform) {
                case 'youtube':
                    dataPoint.youtube = metric.value
                    break
                case 'spotify':
                    dataPoint.spotify = metric.value
                    break
                case 'deezer':
                    dataPoint.deezer = metric.value
                    break
                case 'genius':
                    dataPoint.genius = metric.value
                    break
                case 'musicbrainz':
                    dataPoint.lastfm = metric.value
                    break
            }
        })

        return dataPoint
    }

    return [
        createDataPoint(artist1Metrics, artist1Name),
        createDataPoint(artist2Metrics, artist2Name)
    ]
} 