-- Feature table (Epic 1). Applied automatically in v1 via TypeORM synchronize.
-- Keep this file as the documented schema for later migration tooling.

CREATE TABLE IF NOT EXISTS `feature` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `problem` TEXT NOT NULL,
  `riskTier` ENUM('P1', 'P2', 'P3') NOT NULL,
  `currentStage` ENUM(
    'IDEA',
    'SCOUTING',
    'RFC',
    'RACI',
    'IMPLEMENTATION',
    'TESTING',
    'REVIEW',
    'RELEASE'
  ) NOT NULL DEFAULT 'IDEA',
  `createdByUserId` INT NOT NULL,
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_feature_createdByUserId` (`createdByUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
