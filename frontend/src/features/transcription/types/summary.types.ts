export type SummaryProps = {
    summary: string,
    isLoading: boolean,
    handleGenerateIaSummary: (id:string) => Promise<void>,
    id: string
}