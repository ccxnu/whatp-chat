export abstract class TransformerRepository
{
	abstract generateCertificate(certificate: any): Promise<Buffer>
}
