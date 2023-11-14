-- AlterTable
ALTER TABLE "DiscountAutomaticApp" ALTER COLUMN "orderDiscounts" SET DEFAULT false,
ALTER COLUMN "productDiscounts" SET DEFAULT false,
ALTER COLUMN "shippingDiscounts" SET DEFAULT false,
ALTER COLUMN "endsAt" DROP NOT NULL,
ALTER COLUMN "startsAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "discountId" DROP NOT NULL,
ALTER COLUMN "discountClass" DROP NOT NULL;
