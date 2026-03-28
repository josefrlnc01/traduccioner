import { DocumentService } from "../../document/document.service.js";
import {describe, it, expect } from 'vitest'


describe('DocumentService', () => {
    const segments = [
        {start:0, end:5, text:'Hola'},
        {start:5, end:10, text:'Mundo'}
    ]

    it('generate TXT debe devolver el formato correcto', async () => {
        const txt = await DocumentService.generateTxt(segments)
        expect(txt).toContain('[00:00]:[00:05] Hola')
        expect(txt).toContain('[00:05]:[00:10] Mundo')
    })

    it('generate JSON devuelve JSON válido', async () => {
        const json = await DocumentService.generateJson(segments)
        const parsed = JSON.parse(json)
        expect(parsed).toHaveLength(2)
        expect(parsed[0].text).toBe('Hola')
    })

    it('generate SRT devuelve SRT válido', async () => {
        const srt = await DocumentService.generateSrt(segments)
        expect(srt).toContain('1\n00:00:00,000 --> 00:00:05,000\nHola')
    })

    it('generate VTT devuelve VTT válido', async () => {
        const vtt = await DocumentService.generateVtt(segments)
        expect(vtt).toContain('WEBVTT')
        expect(vtt).toContain('00:00:00.000 --> 00:00:05.000')
    })

    it('generateDocX genera un Buffer', async () => {
        const buffer = await DocumentService.generateDocX(segments)
        expect(Buffer.isBuffer(buffer)).toBe(true)
        expect(buffer.length).toBeGreaterThan(0)
    })

    it('generate PDF genera un buffer', async () => {
        const buffer = await DocumentService.generatePdf(segments)
        expect(Buffer.isBuffer(buffer)).toBe(true)
    })
})