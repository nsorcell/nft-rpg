import { network } from "hardhat";

export class SnapshotManager {
  snapshotId?: number;
  ready: boolean;
  constructor() {
    this.ready = false;

    this.createSnapshot().then(() => (this.ready = true));
  }

  async createSnapshot() {
    this.snapshotId = (await network.provider.request({
      method: "evm_snapshot",
      params: [],
    })) as number;
  }

  async loadSnapshot() {
    if (this.ready) {
      await network.provider.request({
        method: "evm_revert",
        params: [this.snapshotId],
      });

      await this.createSnapshot();
    } else {
      console.error(`Snapshot has not been taken`);
    }
  }
}
