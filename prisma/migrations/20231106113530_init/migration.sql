-- CreateTable
CREATE TABLE "stores" (
    "shop" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "shop" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountAutomaticApp" (
    "id" SERIAL NOT NULL,
    "orderDiscounts" BOOLEAN NOT NULL,
    "productDiscounts" BOOLEAN NOT NULL,
    "shippingDiscounts" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "discountClass" TEXT NOT NULL,
    "selectedCurrencyCode" TEXT,
    "requirementType" TEXT,
    "method" TEXT,
    "requirementSubtotal" TEXT,
    "requirementQuantity" TEXT,
    "eligibility" TEXT,
    "selectedCollections" INTEGER[],
    "selectedProducts" INTEGER[],
    "fixedAmount" FLOAT,
    "quantity" INTEGER,

    CONSTRAINT "DiscountAutomaticApp_pkey" PRIMARY KEY ("id")
);

