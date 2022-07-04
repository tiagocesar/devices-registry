// EntitlementConverter is used to cast JSON into a JS type
export type EntitlementConverter = {
  userId: string;
  entitlements: _Entitlement;
};

type _Entitlement = {
  devices: _Device;
};

type _Device = {
  access_device: string;
  max_devices: number;
};
