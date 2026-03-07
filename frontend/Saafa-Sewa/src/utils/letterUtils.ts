/**
 * Utilities for generating the civic letter content in English and Nepali.
 * Handles number-to-Devanagari conversion for coordinates and location formatting.
 */

const DEVANAGARI_NUMERALS = '०१२३४५६७८९';

/** Convert Arabic numerals to Devanagari (Nepali) numerals */
export function toNepaliNumerals(value: string | number): string {
    return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_NUMERALS[parseInt(d, 10)]);
}

/** Convert a decimal coordinate (e.g. 27.7172) to Nepali numerals */
export function coordinatesToNepali(lat: number, lng: number): string {
    const latStr = lat.toFixed(6);
    const lngStr = lng.toFixed(6);
    return `${toNepaliNumerals(latStr)}, ${toNepaliNumerals(lngStr)}`;
}

const WASTE_TYPE_NEPALI: Record<string, string> = {
    plastic: 'प्लास्टिक',
    organic: 'जैविक',
    mixed: 'मिश्रित',
    construction: 'निर्माण सामग्री',
    hazardous: 'हानिकारक',
    general: 'साधारण',
    default: 'फोहोर',
};

/** Map waste type to Nepali */
export function wasteTypeToNepali(wasteType: string): string {
    const key = wasteType.toLowerCase().trim();
    return WASTE_TYPE_NEPALI[key] ?? WASTE_TYPE_NEPALI.default;
}

const MUNICIPALITY_EN = 'Kathmandu Metropolitan City';
const MUNICIPALITY_NP = 'काठमाडौं महानगरपालिका';

export function getLetterContent(
    lang: 'en' | 'np',
    location: string,
    lat: number,
    lng: number,
    wasteType: string
): string {
    const coordsEn = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    const coordsNp = coordinatesToNepali(lat, lng);
    const wasteNp = wasteTypeToNepali(wasteType);

    if (lang === 'en') {
        return `To: The Ward Chairperson / Mayor, ${MUNICIPALITY_EN}
Subject: Urgent Civic Alert: Unmanaged ${wasteType} Waste at ${location}

Dear Sir/Madam,

I am writing to formally report an escalating public health and environmental hazard located at ${location} (Coordinates: ${coordsEn}).

This site currently contains hazardous accumulations of ${wasteType}. This issue has been logged in the Saafa Sewa civic platform and is severely impacting the local community. We urgently request the municipality to deploy a cleanup crew to this tactical zone.

Sincerely,
A Concerned Citizen via Saafa Sewa`;
    }

    return `श्रीमान् वडा अध्यक्ष / मेयर ज्यू, ${MUNICIPALITY_NP}
विषय: ${location} मा रहेको अव्यवस्थित फोहोर व्यवस्थापन गर्ने सम्बन्धमा।

महोदय,

म ${location} (निर्देशांक: ${coordsNp}) मा बढ्दै गइरहेको जनस्वास्थ्य र वातावरणीय जोखिमको बारेमा औपचारिक रूपमा जानकारी गराउन चाहन्छु।

यस स्थानमा हाल ${wasteNp} जस्ता हानिकारक फोहोरहरू थुप्रिएका छन्। यो समस्या 'साफा सेवा' नागरिक एपमा दर्ता भइसकेको छ र यसले स्थानीय समुदायलाई गम्भीर असर पारिरहेको छ। हामी नगरपालिकालाई यस क्षेत्रमा तत्काल सरसफाई टोली खटाउन विनम्र अनुरोध गर्दछौं।

समुदाय यस विषयमा सचेत छ र सहयोग गर्न तयार छ। हामी तपाईको शिघ्र कदमको अपेक्षा गर्दछौं।

भवदीय,
एक सचेत नागरिक (साफा सेवा मार्फत)`;
}
