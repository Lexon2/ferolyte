import * as os from 'os';

export const getMinecraftDirectory = (useMinecraftPreview: boolean = false) =>
  os.homedir() +
  (useMinecraftPreview
    ? '/AppData/Local/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang/'
    : '/AppData/Roaming/Minecraft Bedrock/users/shared/games/com.mojang');
