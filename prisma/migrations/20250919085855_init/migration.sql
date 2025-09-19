-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "notoriety" INTEGER NOT NULL DEFAULT 0,
    "maxHp" INTEGER NOT NULL DEFAULT 100,
    "maxMp" INTEGER NOT NULL DEFAULT 50,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NPC" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "deathYear" INTEGER,
    "isAlive" BOOLEAN NOT NULL DEFAULT true,
    "mood" TEXT NOT NULL,
    "fame" INTEGER NOT NULL DEFAULT 0,
    "notoriety" INTEGER NOT NULL DEFAULT 0,
    "cityId" INTEGER NOT NULL,
    "partnerId" INTEGER,
    "parent1Id" INTEGER,
    "parent2Id" INTEGER,
    "isNoble" BOOLEAN NOT NULL DEFAULT false,
    "nobleTitle" TEXT,
    "personality" TEXT,
    "languageId" INTEGER NOT NULL,
    "religionId" INTEGER,

    CONSTRAINT "NPC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WildArea" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dangerLevel" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,
    "cityId" INTEGER,

    CONSTRAINT "WildArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dungeon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "levelRequirement" INTEGER NOT NULL,
    "isRaid" BOOLEAN NOT NULL,
    "countryId" INTEGER NOT NULL,
    "cityId" INTEGER,

    CONSTRAINT "Dungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isTaken" BOOLEAN NOT NULL DEFAULT false,
    "takenAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "reputationRequired" INTEGER NOT NULL,
    "notorietyTrigger" BOOLEAN NOT NULL,
    "issuerId" INTEGER,
    "takerId" INTEGER,
    "bountyTargetId" INTEGER,
    "metadata" JSONB,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerProfession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "skillLevel" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlayerProfession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quality" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemInstance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ItemInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recipe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecipeMaterial" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "RecipeMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Corpse" (
    "id" SERIAL NOT NULL,
    "npcId" INTEGER,
    "userId" INTEGER,
    "type" TEXT NOT NULL,
    "decayStage" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "causeOfDeath" TEXT,
    "isWaterlogged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Corpse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimalPopulation" (
    "id" SERIAL NOT NULL,
    "species" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "AnimalPopulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isAncient" BOOLEAN NOT NULL DEFAULT false,
    "region" TEXT,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserLanguage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "fluency" INTEGER NOT NULL,

    CONSTRAINT "UserLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Religion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "originRegion" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "doctrine" TEXT NOT NULL,
    "influenceLevel" INTEGER NOT NULL,
    "estimatedFollowers" INTEGER NOT NULL,

    CONSTRAINT "Religion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Artifact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lore" TEXT NOT NULL,
    "powerHint" TEXT NOT NULL,
    "religionId" INTEGER NOT NULL,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GlobalEvent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "affectedRegion" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "impact" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "GlobalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Weather" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Weather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NPCStory" (
    "id" SERIAL NOT NULL,
    "npcId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NPCStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlayerTitle" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL,
    "authority" INTEGER NOT NULL,

    CONSTRAINT "PlayerTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Economy" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "demand" TEXT NOT NULL,
    "supply" TEXT NOT NULL,

    CONSTRAINT "Economy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorldTime" (
    "id" SERIAL NOT NULL,
    "lastSimulated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorldTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorldSnapshot" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "jsonData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorldSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaxPolicy" (
    "id" SERIAL NOT NULL,
    "region" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "public"."Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Weather_cityId_key" ON "public"."Weather"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "Economy_cityId_item_key" ON "public"."Economy"("cityId", "item");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPolicy_region_key" ON "public"."TaxPolicy"("region");

-- AddForeignKey
ALTER TABLE "public"."NPC" ADD CONSTRAINT "NPC_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NPC" ADD CONSTRAINT "NPC_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NPC" ADD CONSTRAINT "NPC_religionId_fkey" FOREIGN KEY ("religionId") REFERENCES "public"."Religion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."City" ADD CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WildArea" ADD CONSTRAINT "WildArea_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WildArea" ADD CONSTRAINT "WildArea_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dungeon" ADD CONSTRAINT "Dungeon_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dungeon" ADD CONSTRAINT "Dungeon_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quest" ADD CONSTRAINT "Quest_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "public"."NPC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quest" ADD CONSTRAINT "Quest_takerId_fkey" FOREIGN KEY ("takerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerProfession" ADD CONSTRAINT "PlayerProfession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemInstance" ADD CONSTRAINT "ItemInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemInstance" ADD CONSTRAINT "ItemInstance_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recipe" ADD CONSTRAINT "Recipe_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecipeMaterial" ADD CONSTRAINT "RecipeMaterial_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecipeMaterial" ADD CONSTRAINT "RecipeMaterial_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnimalPopulation" ADD CONSTRAINT "AnimalPopulation_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."WildArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLanguage" ADD CONSTRAINT "UserLanguage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLanguage" ADD CONSTRAINT "UserLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "public"."Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Artifact" ADD CONSTRAINT "Artifact_religionId_fkey" FOREIGN KEY ("religionId") REFERENCES "public"."Religion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Weather" ADD CONSTRAINT "Weather_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NPCStory" ADD CONSTRAINT "NPCStory_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "public"."NPC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlayerTitle" ADD CONSTRAINT "PlayerTitle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Economy" ADD CONSTRAINT "Economy_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
