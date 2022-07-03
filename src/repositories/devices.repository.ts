import {connect, model, Model, Schema} from "mongoose";
import {IDevice} from "../models/devices.model";


export class DevicesRepository {
    private readonly DeviceModel: Model<IDevice>

    constructor(user: string, password: string, host: string, port: string, database: string) {
        // Define the necessary schema/model
        const deviceSchema = new Schema<IDevice>({
            id: String,
            userId: String,
            name: String,
            playable: Boolean
        });

        this.DeviceModel = model<IDevice>("Device", deviceSchema);

        // Connect to MongoDB
        const uri = `mongodb://${user}:${password}@${host}:${port}/`;

        connect(uri).then(
            () => {
                console.log("Connected to database");
            },
            err => {
                throw err;
            }
        );
    }

    async getDevicesForUser(userId: string): Promise<IDevice[]> {
        return await this.DeviceModel.find({userId: userId}).lean()
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }

    async getDeviceById(userid: string, id: string): Promise<IDevice[]> {
        return await this.DeviceModel.find({userId: userid, _id: id}).lean()
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }

    async registerDevice(device: IDevice): Promise<boolean> {
        const dm = new this.DeviceModel({
            userId: device.userId,
            name: device.name,
            playable: device.playable
        });

        await dm.save()
            .then(() => {
                return true
            })
            .catch(error => {
                throw error;
            });

        return false;
    }

    async getActiveDevicesCount(userId: string): Promise<number> {
        return this.DeviceModel.count({userId: userId, playable: true});
    }

    updateDevice(device: IDevice) {}
}

export default DevicesRepository
