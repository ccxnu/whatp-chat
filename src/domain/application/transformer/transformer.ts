import { CertificateDetails } from "@/domain/value-objects/certificate-details";

export abstract class TransformerRepository
{
	abstract generateCertificate(certificate: CertificateDetails): Promise<Buffer>
}
