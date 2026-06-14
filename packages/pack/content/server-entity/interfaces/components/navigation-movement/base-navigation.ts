export interface BaseNavigation {
    /**
     * Tells the pathfinder to avoid blocks that cause damage when finding a path.
     */
    avoidDamageBlocks?: boolean;

    /**
     * Tells the pathfinder to avoid portals (like nether portals) when finding a path.
     */
    avoidPortals?: boolean;

    /**
     * Whether or not the pathfinder should avoid tiles that are exposed to the sun when creating paths.
     */
    avoidSun?: boolean;

    /**
     * Tells the pathfinder to avoid water when creating a path.
     */
    avoidWater?: boolean;

    /**
     * Tells the pathfinder which blocks to avoid when creating a path.
     */
    blocksToAvoid?: string[];

    /**
     * Tells the pathfinder whether or not it can jump out of water (like a dolphin).
     */
    canBreach?: boolean;

    /**
     * Tells the pathfinder that it can path through a closed door and break it.
     */
    canBreakDoors?: boolean;

    /**
     * Tells the pathfinder whether or not it can jump up blocks.
     */
    canJump?: boolean;

    /**
     * Tells the pathfinder that it can path through a closed door assuming the AI will open the door.
     */
    canOpenDoors?: boolean;

    /**
     * Tells the pathfinder that it can path through a closed iron door assuming the AI will open the door.
     */
    canOpenIronDoors?: boolean;

    /**
     * Whether a path can be created through a door.
     */
    canPassDoors?: boolean;

    /**
     * Tells the pathfinder that it can start pathing when in the air.
     */
    canPathFromAir?: boolean;

    /**
     * Tells the pathfinder whether or not it can travel on the surface of the lava.
     */
    canPathOverLava?: boolean;

    /**
     * Tells the pathfinder whether or not it can travel on the surface of the water.
     */
    canPathOverWater?: boolean;

    /**
     * Tells the pathfinder whether or not it will be pulled down by gravity while in water.
     */
    canSink?: boolean;

    /**
     * Tells the pathfinder whether or not it can path anywhere through water and plays swimming animation along that path.
     */
    canSwim?: boolean;

    /**
     * Tells the pathfinder whether or not it can walk on the ground outside water.
     */
    canWalk?: boolean;

    /**
     * Tells the pathfinder whether or not it can travel in lava like walking on ground.
     */
    canWalkInLava?: boolean;

    /**
     * Tells the pathfinder whether or not it can walk on the ground underwater.
     */
    isAmphibious?: boolean;
}
