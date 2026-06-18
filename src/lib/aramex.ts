const ARAMEX_BASE =
  "https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json";

interface AramexCredentials {
  UserName: string;
  Password: string;
  Version: string;
  AccountNumber: string;
  AccountPin: string;
  AccountEntity: string;
  AccountCountryCode: string;
}

function getCredentials(): AramexCredentials {
  return {
    UserName: process.env.ARAMEX_USERNAME!,
    Password: process.env.ARAMEX_PASSWORD!,
    Version: "v1.0",
    AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER!,
    AccountPin: process.env.ARAMEX_PIN!,
    AccountEntity: process.env.ARAMEX_ACCOUNT_ENTITY!,
    AccountCountryCode: process.env.ARAMEX_ACCOUNT_COUNTRYCODE!,
  };
}

export interface ShipmentDetails {
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  city: string;
  countryCode: string;
  weightKg: number;
  description: string;
  reference: string;
}

export async function createShipment(details: ShipmentDetails): Promise<{
  shipmentId: string;
  trackingNumber: string;
  labelUrl?: string;
}> {
  // Dev mock: return a fake tracking number
  if (process.env.USE_MOCK_DB === "true") {
    const fakeAwb = `MOCK${Math.floor(Math.random() * 900000000 + 100000000)}`;
    console.log(`[MockAramex] Created fake shipment for ${details.reference}: ${fakeAwb}`);
    return { shipmentId: fakeAwb, trackingNumber: fakeAwb };
  }

  const creds = getCredentials();
  const payload = {
    ClientInfo: creds,
    Transaction: {
      Reference1: details.reference,
      Reference2: "",
      Reference3: "",
      Reference4: "",
      Reference5: "",
    },
    Shipments: [
      {
        Shipper: {
          Reference1: details.reference,
          Reference2: "",
          AccountNumber: creds.AccountNumber,
          PartyAddress: {
            Line1: process.env.STORE_ADDRESS_LINE1 ?? "Store Address",
            Line2: "",
            Line3: "",
            City: process.env.STORE_CITY ?? "Dubai",
            PostCode: "",
            CountryCode: "AE",
          },
          Contact: {
            Department: "",
            PersonName: "FLAMEMARKET Store",
            Title: "",
            CompanyName: "FLAMEMARKET",
            PhoneNumber1: process.env.STORE_PHONE ?? "+971500000000",
            PhoneNumber1Ext: "",
            PhoneNumber2: "",
            PhoneNumber2Ext: "",
            FaxNumber: "",
            CellPhone: process.env.STORE_PHONE ?? "+971500000000",
            EmailAddress: process.env.STORE_EMAIL ?? "hello@flamemarket.com",
            Type: "",
          },
        },
        Consignee: {
          Reference1: details.reference,
          Reference2: "",
          AccountNumber: "",
          PartyAddress: {
            Line1: details.addressLine1,
            Line2: "",
            Line3: "",
            City: details.city,
            PostCode: "",
            CountryCode: details.countryCode,
          },
          Contact: {
            Department: "",
            PersonName: details.recipientName,
            Title: "",
            CompanyName: "",
            PhoneNumber1: details.recipientPhone,
            PhoneNumber1Ext: "",
            PhoneNumber2: "",
            PhoneNumber2Ext: "",
            FaxNumber: "",
            CellPhone: details.recipientPhone,
            EmailAddress: "",
            Type: "",
          },
        },
        TransportType: 0,
        ShippingDateTime: new Date().toISOString(),
        DueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        PickupLocation: "Reception",
        PickupGUID: "",
        Comments: "",
        AccountingInstrcutions: "",
        OperationsInstructions: "",
        Details: {
          Dimensions: null,
          ActualWeight: { Value: details.weightKg, Unit: "KG" },
          ChargeableWeight: null,
          DescriptionOfGoods: details.description,
          GoodsOriginCountry: "AE",
          NumberOfPieces: 1,
          ProductGroup: "EXP",
          ProductType: "PPX",
          PaymentType: "P",
          PaymentOptions: "",
          CustomsValueAmount: null,
          CashOnDeliveryAmount: null,
          InsuranceAmount: null,
          CashAdditionalAmount: null,
          CashAdditionalAmountDescription: "",
          CollectAmount: null,
          Services: "",
          Items: [],
        },
      },
    ],
    LabelInfo: { ReportID: 9201, ReportType: "URL" },
  };

  const res = await fetch(`${ARAMEX_BASE}/CreateShipments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Aramex HTTP error: ${res.status}`);
  const json = await res.json();
  if (json.HasErrors) {
    throw new Error(
      json.Notifications?.map((n: { Message: string }) => n.Message).join(", ") ??
        "Aramex error"
    );
  }

  const shipment = json.Shipments?.[0];
  return {
    shipmentId: shipment?.ID ?? "",
    trackingNumber: shipment?.ID ?? "",
    labelUrl: json.ShipmentLabels?.[0]?.LabelURL,
  };
}

export async function getTracking(trackingNumber: string): Promise<{
  status: string;
  updateDescription: string;
  updateDateTime: string;
  trackingEvents: Array<{
    description: string;
    dateTime: string;
    location: string;
  }>;
}> {
  // Dev mock: return a realistic fake tracking timeline
  if (process.env.USE_MOCK_DB === "true" || trackingNumber.startsWith("MOCK")) {
    const now = new Date();
    return {
      status: "SH",
      updateDescription: "Shipment picked up",
      updateDateTime: now.toISOString(),
      trackingEvents: [
        {
          description: "Shipment delivered successfully",
          dateTime: new Date(now.getTime() - 1 * 3600000).toISOString(),
          location: "Dubai, AE",
        },
        {
          description: "Out for delivery",
          dateTime: new Date(now.getTime() - 5 * 3600000).toISOString(),
          location: "Dubai Delivery Hub, AE",
        },
        {
          description: "Arrived at Dubai hub",
          dateTime: new Date(now.getTime() - 12 * 3600000).toISOString(),
          location: "Dubai, AE",
        },
        {
          description: "Shipment picked up from sender",
          dateTime: new Date(now.getTime() - 30 * 3600000).toISOString(),
          location: "Dubai, AE",
        },
      ],
    };
  }

  const creds = getCredentials();
  const payload = {
    ClientInfo: creds,
    Transaction: {
      Reference1: "", Reference2: "", Reference3: "", Reference4: "", Reference5: "",
    },
    Shipments: [{ ID: trackingNumber }],
    GetLastTrackingUpdateOnly: false,
  };

  const res = await fetch(
    "https://ws.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackShipments",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error(`Aramex tracking error: ${res.status}`);

  const json = await res.json();
  const updates = json.TrackingResults?.[0]?.Value ?? [];
  const latest = updates[0] ?? {};

  return {
    status: latest.UpdateCode ?? "UNKNOWN",
    updateDescription: latest.UpdateDescription ?? "No updates yet",
    updateDateTime: latest.UpdateDateTime ?? "",
    trackingEvents: updates.map((u: {
      UpdateDescription?: string;
      UpdateDateTime?: string;
      UpdateLocation?: string;
    }) => ({
      description: u.UpdateDescription ?? "",
      dateTime: u.UpdateDateTime ?? "",
      location: u.UpdateLocation ?? "",
    })),
  };
}
