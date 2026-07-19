import crypto from "node:crypto";
import { integrationConfig } from "@/lib/integrations/config";

export function createCloudinarySignature(folder = integrationConfig.cloudinary.uploadFolder) {
  if (
    !integrationConfig.cloudinary.cloudName ||
    !integrationConfig.cloudinary.apiKey ||
    !integrationConfig.cloudinary.apiSecret
  ) {
    return { configured: false as const };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params = `folder=${folder}&timestamp=${timestamp}${integrationConfig.cloudinary.apiSecret}`;
  const signature = crypto.createHash("sha1").update(params).digest("hex");

  return {
    configured: true as const,
    cloudName: integrationConfig.cloudinary.cloudName,
    apiKey: integrationConfig.cloudinary.apiKey,
    folder,
    timestamp,
    signature,
  };
}
