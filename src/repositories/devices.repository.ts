import {connect, model, Model, Schema} from "mongoose";


export class DevicesRepository {
    private Device: Model<IDevice>

    constructor(user: string, password: string, host: string, port: string, database: string) {
        // Define the necessary schema/model
        const deviceSchema = new Schema<IDevice>({
            id: String,
            userId: String,
            name: String,
            playable: Boolean
        });

        this.Device = model<IDevice>("Device", deviceSchema);

        // Connect to MongoDB
        const uri = `mongodb://${user}:${password}@${host}:${port}/${database}`;

        connect(uri, {
            keepAlive: true
        }).then(
            () => {
                console.log("Connected to database");
            },
            err => {
                throw err;
            }
        );
    }

    async getDevicesForUser(userId: string): Promise<IDevice[]> {
        return await this.Device.find({userId: userId}).lean()
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }

    registerDevice(device: IDevice) {}

    updateDevice(device: IDevice) {}
}

export default DevicesRepository
