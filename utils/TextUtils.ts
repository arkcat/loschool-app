export function getBase64Text(text: string): string {
    return Buffer.from(text, 'utf8').toString('base64')
}

export function getPlainText(text: string): string {
    return Buffer.from(text, 'base64').toString('utf8')
}