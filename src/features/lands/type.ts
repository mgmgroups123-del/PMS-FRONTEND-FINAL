
export type LandsDetails = {
    land_name: string;
    square_feet: string;
    acre: string;
    cent: string,
    land_address: string,
    owner_information: {
        full_name: string,
        email: string,
        phone: string,
        address: string
    },
    uuid?: string,
    is_active?: boolean,
    is_deleted?: boolean,
    image: string
}

export interface LandsInitialstate {
    lands: LandsDetails[];
    selectedLand: LandsDetails;
}