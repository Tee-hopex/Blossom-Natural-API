import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db';
import { Category, Product } from '../models';

const productsData = [
  {
    name: 'African Bubbles Shampoo',
    price: 7000,
    categoryName: 'Shampoos',
    description: 'A rich cleansing shampoo with a refreshing minty feel that leaves your scalp clean, cool, and refreshed without stripping your hair.',
    ingredients: ['Water', 'African black soap', 'glycerin', 'Ayurvedic herb-infused oil', 'panthenol', 'aloe vera juice', 'peppermint oil', 'tea tree oil', 'neem extract', 'polyquat', 'chelator', 'hydrolyzed wheat protein', 'pH adjuster', 'fragrance', 'preservative'],
    benefits: ['Gently removes buildup and cleanses the scalp without leaving hair dry or crunchy.', 'Infused with hydrating ingredients that help soften strands.', 'Creates a healthy scalp environment.', 'Delivers a refreshing cooling sensation.'],
    usage: 'Apply to wet scalp and hair. Massage gently into the scalp. Work into a rich lather. Rinse thoroughly.',
    suitableFor: ['Coily hair', 'Curly hair', 'Kinky hair', 'Locs', 'Relaxed hair', 'Braids & wigs'],
    freeFrom: ['Mineral oil', 'Harsh sulfates', 'Drying alcohols', 'Heavy silicones'],
    warning: 'For external use only. Avoid contact with eyes. If contact occurs, rinse thoroughly with water. Perform a patch test before use. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: []
  },
  {
    name: 'Clarifying Shampoo',
    price: 7000,
    categoryName: 'Shampoos',
    description: 'A scalp-refreshing clarifying shampoo infused with botanicals, Ayurvedic extracts, and moisture-supporting ingredients.',
    ingredients: ['Water', 'decyl glucoside', 'cocamidopropyl betaine', 'aloe vera juice', 'chamomile hydrosol', 'glycerin', 'neem extract', 'peppermint oil', 'tea tree oil', 'Ayurvedic herb extract', 'willow bark extract', 'panthenol', 'polyquat'],
    benefits: ['Removes buildup and excess oils', 'Refreshes itchy scalp', 'Clarifies without stripping', 'Supports softer, manageable hair', 'Helps reduce flakes and residue'],
    usage: 'Apply to wet scalp and hair. Massage gently into the scalp. Work into a rich lather. Rinse thoroughly. Recommended Use: Once monthly.',
    suitableFor: ['Coily hair', 'Curly hair', 'Kinky hair', 'Locs', 'Relaxed hair', 'Braids & wigs', 'Heavy product users', 'Oily scalp', 'Itchy scalp/dandruff', 'Flaky scalp', 'Wash day resets', 'Post-braid cleansing', 'Low porosity hair routines'],
    freeFrom: ['Mineral oil', 'Harsh sulfates', 'Drying alcohols', 'Heavy silicones'],
    warning: 'For external use only. Avoid contact with eyes. If contact occurs, rinse thoroughly with water. Perform a patch test before use. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: []
  },
  {
    name: 'Moisturizing Deep Conditioner',
    price: 7000,
    categoryName: 'Conditioners',
    description: 'A rich, moisturizing deep conditioner formulated to restore softness, improve manageability, and deeply nourish dry, thirsty strands.',
    ingredients: ['Water', 'glycerin', 'panthenol', 'BTMS-50', 'cetyl alcohol', 'sunflower oil', 'coconut oil', 'shea butter', 'cocoa butter', 'mango butter', 'aloe vera juice', 'bamboo extract', 'slippery elm extract'],
    benefits: ['Deeply moisturizes dry strands', 'Provides excellent slip', 'Leaves hair feeling softer', 'Supports moisture retention'],
    usage: 'Apply generously to freshly cleansed hair, focusing on mid-lengths and ends. Leave on for 15–30 minutes. Rinse thoroughly.',
    suitableFor: ['Curly hair', 'Coily hair', 'Kinky hair', 'Relaxed hair', 'Color-treated hair', 'Locs', 'Wigs & extensions', 'Dry hair', 'Brittle strands', 'Tangled hair', 'High porosity hair', 'Protective style recovery'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'Will this weigh my hair down?', answer: 'The formula is rich and nourishing but designed to rinse clean while leaving hair soft and moisturized. Usage can be adjusted based on your hair’s needs.' },
      { question: 'Is this suitable for low porosity hair?', answer: 'Yes. Using heat or steam may help improve absorption.' },
      { question: 'Can I use this every wash day?', answer: 'Absolutely. It is suitable for regular deep conditioning routines.' },
      { question: 'Does it contain protein?', answer: 'The formula focuses primarily on moisture and conditioning support, though bamboo extract may contribute strengthening benefits.' },
      { question: 'Can I leave it in overnight?', answer: 'For best results, use as directed and rinse thoroughly after treatment.' }
    ]
  },
  {
    name: 'Protein Deep Conditioner',
    price: 7500,
    categoryName: 'Conditioners',
    description: 'A strengthening deep conditioner formulated to help reinforce weak strands, reduce breakage, and restore softness without leaving hair hard or brittle.',
    ingredients: ['Water', 'glycerin', 'panthenol', 'BTMS-50', 'cetyl alcohol', 'sunflower oil', 'hydrolyzed wheat protein', 'silk peptide', 'hydrolyzed oat protein', 'slippery elm extract'],
    benefits: ['Strengthens weak strands', 'Helps reduce breakage', 'Protein-balanced formula', 'Softens while strengthening', 'Improves elasticity and resilience'],
    usage: 'Apply generously to freshly cleansed hair. Focus on weak or damaged areas. Leave on for 15–30 minutes. Rinse thoroughly.',
    suitableFor: ['Curly hair', 'Coily hair', 'Kinky hair', 'Relaxed hair', 'Transitioning hair', 'Color-treated hair', 'Protective style recovery', 'Weak hair', 'Breakage-prone strands', 'Heat-damaged hair'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'Will this make my hair hard?', answer: 'No. The formula balances strengthening proteins with moisturizing ingredients to maintain softness and manageability.' },
      { question: 'How often should I use this?', answer: 'Most users apply protein treatments every 4–8 weeks depending on hair needs and damage level.' },
      { question: 'Is this suitable for low porosity hair?', answer: 'Yes. Heat or steam may help improve absorption.' },
      { question: 'Can I alternate this with a moisturizing deep conditioner?', answer: 'Absolutely. Alternating moisture and protein treatments helps maintain balance.' },
      { question: 'Is this safe for color-treated or heat-damaged hair?', answer: 'Yes. It is especially beneficial for damaged or weakened hair.' },
      { question: 'Can I use this every wash day?', answer: 'Frequency should depend on your hair’s needs. Overuse may cause stiffness for some hair types.' }
    ]
  },
  {
    name: 'Moisturizing Leave-In Conditioner',
    price: 7000,
    categoryName: 'Conditioners',
    description: 'A lightweight moisturizing leave-in conditioner designed to hydrate, soften, and improve manageability without leaving the hair heavy or greasy.',
    ingredients: ['Water', 'glycerin', 'panthenol', 'BTMS-50', 'cetyl alcohol', 'sunflower oil', 'coconut oil', 'shea butter', 'aloe vera juice', 'bamboo extract', 'slippery elm extract'],
    benefits: ['Lightweight daily moisture', 'Softens and smooths hair', 'Helps reduce tangles', 'Supports moisture retention'],
    usage: 'Apply to damp or dry hair. Focus on mid-lengths and ends. Distribute evenly through hair. Style as desired.',
    suitableFor: ['Curly hair', 'Coily hair', 'Kinky hair', 'Low porosity hair', 'High porosity hair', 'Relaxed hair', 'Color-treated hair', 'Protective styles', 'Dry hair', 'Frizz control'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'Will this weigh my hair down?', answer: 'No. The formula is lightweight and layers easily into your routine.' },
      { question: 'Is this suitable for low porosity hair?', answer: 'Yes. Its lightweight texture works especially well for low porosity hair.' },
      { question: 'Can I use this daily?', answer: 'Absolutely.' },
      { question: 'Can I use this under gels or stylers?', answer: 'Yes. It layers well underneath styling products.' },
      { question: 'Is this a cream or lotion consistency?', answer: 'It has a lightweight creamy consistency.' },
      { question: 'Does it help with detangling?', answer: 'Yes. Ingredients like slippery elm extract help improve slip and manageability.' }
    ]
  },
  {
    name: 'Moisturizing Hair Butter',
    price: 7000,
    categoryName: 'Styling & Sealing',
    description: 'A rich whipped hair butter designed to seal in moisture, soften strands, and nourish dry, textured hair for long-lasting hydration and shine.',
    ingredients: ['Water', 'glycerin', 'panthenol', 'BTMS-50', 'cetyl alcohol', 'sunflower oil', 'coconut oil', 'castor oil', 'shea butter', 'cocoa butter', 'mango butter'],
    benefits: ['Seals in moisture for lasting hydration', 'Softens dry, coarse strands', 'Nourishes with rich butters and oils', 'Adds shine and smoothness'],
    usage: 'Apply after leave-in conditioner on damp or dry hair. Use a small amount and rub between palms. Apply to mid-lengths and ends.',
    suitableFor: ['Curly hair', 'Coily hair', 'Kinky hair', 'High porosity hair', 'Natural hair routines', 'Locs', 'Braids & extensions', 'Dry hair', 'Thick hair', 'Coarse textures'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'Is this a moisturizer or a leave-in conditioner?', answer: 'This is a sealing butter, not a leave-in conditioner. It is designed to lock in moisture after applying your leave-in conditioner.' },
      { question: 'Will it make my hair greasy?', answer: 'When used in small amounts, it provides nourishment and shine without heaviness. A little goes a long way.' },
      { question: 'Can I use this on wet or dry hair?', answer: 'Both. It works best on damp, moisturized hair as a sealing step but can also be used on dry hair for added softness and shine.' },
      { question: 'Is this suitable for protective styles?', answer: 'Yes. It is excellent for braids, twists, locs, and other protective styles to maintain softness and reduce dryness.' },
      { question: 'Can I use it daily?', answer: 'Yes, but sparingly. It is best used as needed for moisture sealing rather than heavy daily application.' }
    ]
  },
  {
    name: 'Wild Growth Pomade',
    price: 7500,
    categoryName: 'Styling & Sealing',
    description: 'Our Wild Growth Pomade is a nutrient-rich herbal styling balm crafted with a powerful blend of botanical oils, butters, and Ayurvedic extracts.',
    ingredients: ['Sunflower oil', 'olive oil', 'argan oil', 'jojoba oil', 'avocado oil', 'castor oil', 'beeswax', 'mango butter', 'cocoa butter', 'Ayurvedic extracts'],
    benefits: ['Seals in moisture for long-lasting hydration', 'Nourishes the scalp with Ayurvedic botanicals', 'Adds natural shine and softness', 'Provides light hold for styling'],
    usage: 'Apply after leave-in conditioner to lock in moisture, or use for twists, braids, and edge styling.',
    suitableFor: ['Curly hair', 'Coily hair', 'Kinky hair', 'Locs', 'Braids & twists', 'Natural hair routines', 'High porosity hair', 'Thick textured hair', 'Dry hair', 'Protective styles'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Perform a patch test before use. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'Is this pomade heavy or greasy?', answer: 'Wild Growth Pomade is a rich herbal balm designed to seal moisture and support styling. Because it contains butters and oils, a small amount goes a long way. When used correctly, it should feel nourishing rather than greasy or heavy.' },
      { question: 'Can I use this on my scalp?', answer: 'Yes. This pomade contains herbal and essential oils like rosemary, peppermint, and tea tree that help support scalp freshness. Use a small amount, especially if you have a sensitive scalp.' },
      { question: 'Is this a moisturizer or a sealing product?', answer: 'This is a sealing pomade, not a water-based moisturizer. It is best used after a leave-in conditioner or hair mist to lock in moisture and prevent dryness.' },
      { question: 'Will it help with hair growth?', answer: 'Wild Growth Pomade is formulated with Ayurvedic herbs and botanical oils that support a healthy scalp environment and help reduce breakage. While it does not guarantee hair growth, it supports healthier-looking hair over time.' },
      { question: 'Can I use this for styling?', answer: 'Yes. It works well for twists, braids, loc maintenance, and edge styling. It provides light hold, shine, and definition without stiffness.' },
      { question: 'Will it clog my pores or build up on my scalp?', answer: 'When used in moderation, it should not clog pores. However, because it is oil- and butter-based, proper scalp cleansing is recommended to avoid buildup over time.' },
      { question: 'Is this suitable for daily use?', answer: 'It can be used daily or as needed, though many users prefer applying it 2–4 times weekly or during styling routines.' },
      { question: 'Is it safe for protective styles like braids or locs?', answer: 'Yes. It is excellent for protective styles and helps maintain moisture and softness between wash days.' },
      { question: 'Does it contain protein?', answer: 'No. This formula is moisture- and oil-based, designed for nourishment, sealing, and styling support.' },
      { question: 'What does it smell like?', answer: 'It has a warm scent blended with peppermint, tea tree, and citrus vanilla notes, creating a fresh, natural, slightly earthy aroma.' },
      { question: 'Can I use it on wet or dry hair?', answer: 'Both. It works best on damp or moisturized hair as a sealing step but can also be applied to dry hair for shine, styling, and frizz control.' },
      { question: 'How much should I use?', answer: 'Start with a small amount. Because of the butter and wax content, a little goes a long way. Add more only if needed based on hair thickness and styling needs.' }
    ]
  },
  {
    name: 'Wild Growth Oil',
    price: 7000,
    categoryName: 'Scalp & Hair Treatments',
    description: 'Our Wild Growth Oil is a potent blend of Ayurvedic herbs, botanical extracts, and nutrient-rich carrier oils designed to nourish the scalp and support stronger, healthier-looking hair.',
    ingredients: ['Sunflower oil', 'olive oil', 'argan oil', 'jojoba oil', 'avocado oil', 'castor oil', 'fenugreek', 'rosemary', 'amla', 'hibiscus', 'moringa', 'peppermint oil', 'tea tree oil'],
    benefits: ['Nourishes scalp and hair roots', 'Supports stronger, healthier-looking hair', 'Helps reduce breakage and dryness', 'Refreshing scalp stimulation'],
    usage: 'Apply directly to the scalp and massage gently for 2–5 minutes.',
    suitableFor: ['Curly hair', 'Coily hair', 'Kinky hair', 'Locs', 'Braids & twists', 'Relaxed hair', 'Color-treated hair', 'Protective styles', 'Dry scalp', 'Breakage-prone hair', 'Weak or thinning-looking hair'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Perform a patch test before use. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'Does this oil grow hair?', answer: 'This oil is designed to support a healthy scalp environment and reduce breakage, which may support the appearance of healthier, fuller-looking hair over time.' },
      { question: 'Can I use it daily?', answer: 'Yes, but in small amounts. It can be used daily for scalp massage or a few times weekly depending on your routine.' },
      { question: 'Will it make my hair greasy?', answer: 'It is a rich oil blend, so a little goes a long way. Use sparingly for best results.' },
      { question: 'Can I use it on protective styles?', answer: 'Yes. It is excellent for braids, twists, and locs to maintain scalp nourishment.' },
      { question: 'Is it suitable for all hair types?', answer: 'Yes, especially textured, dry, or brittle hair types.' }
    ]
  },
  {
    name: 'Ayurvedic Tea Mist',
    price: 7000,
    categoryName: 'Scalp & Hair Treatments',
    description: 'Our Ayurvedic Tea Mist is a refreshing botanical spray infused with traditional herbs, hydrating botanicals, and scalp-supporting ingredients.',
    ingredients: ['Water', 'chamomile hydrosol', 'aloe vera juice', 'green tea', 'fenugreek', 'rosemary', 'hibiscus', 'panthenol', 'glycerin', 'MSM', 'biotin'],
    benefits: ['Hydrates and refreshes the scalp instantly', 'Lightweight daily moisture mist', 'Soothes itchy or dry scalp', 'Supports stronger-looking hair'],
    usage: 'Spray directly onto the scalp and massage gently, or spray onto hair to refresh dryness between wash days.',
    suitableFor: ['Curly hair', 'Coily hair', 'Kinky hair', 'Locs', 'Braids & extensions', 'Natural hair', 'Color-treated hair', 'Relaxed hair', 'Dry scalp', 'Daily moisture refresh', 'Protective styles', 'Itchy scalp'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Perform a patch test before use. Keep out of reach of children. Store in a cool place away from direct sunlight.',
    faqs: [
      { question: 'Can I use this every day?', answer: 'Yes. This mist is lightweight and designed for daily or frequent use.' },
      { question: 'Will it make my hair greasy?', answer: 'No. It is a water-based mist designed for hydration without heaviness or buildup.' },
      { question: 'Can it replace my leave-in conditioner?', answer: 'No. It is a hydration and scalp-refresh mist meant to complement your leave-in, not replace it.' },
      { question: 'Is it good for protective styles?', answer: 'Yes. It is excellent for keeping braids, twists, and locs refreshed and hydrated.' },
      { question: 'Does it help with hair growth?', answer: 'It supports a healthy scalp environment and strengthens strands over time, which may support healthier-looking hair.' }
    ]
  },
  {
    name: 'Scalp Therapy Combo',
    price: 28000,
    categoryName: 'Kits & Bundles',
    description: 'A complete scalp reset and hydration routine designed to cleanse buildup, calm irritated scalps, restore moisture, and support healthier hair growth.',
    ingredients: ['Clarifying Shampoo', 'Deep Conditioner', 'Leave-In Conditioner', 'Tea Mist'],
    benefits: ['Helps reduce scalp buildup and itchiness', 'Hydrates dry hair and scalp', 'Perfect after protective styles and braids'],
    usage: 'Cleanse with Clarifying Shampoo, Treat with Deep Conditioner, Moisturize with Leave-In, Refresh Daily with Tea Mist.',
    suitableFor: ['Dry scalp', 'Product buildup', 'Protective styles', 'Knotless braids recovery', 'Itchy scalp', 'Moisture-deprived hair', 'Low porosity hair needing lightweight hydration'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'Is this combo good for dandruff-prone scalp?', answer: 'This combo was curated with lightweight hydration in mind and avoids heavy oils that may worsen buildup for some people.' },
      { question: 'Can I use this while wearing braids?', answer: 'Yes. The Ayurvedic Tea Mist is perfect for refreshing the scalp while in protective styles.' },
      { question: 'Will this dry out my hair?', answer: 'No. The combo balances cleansing with deep hydration and moisture restoration.' },
      { question: 'How often should I use the clarifying shampoo?', answer: '2x times monthly or as needed depending on buildup.' },
      { question: 'Is this combo suitable for all curl types?', answer: 'Yes, especially textured, curly, coily, and natural hair.' }
    ]
  },
  {
    name: 'Anti-Breakage Combo',
    price: 28500,
    categoryName: 'Kits & Bundles',
    description: 'This combo is your reset button, designed to cleanse, rebuild, and lock in moisture, strengthening your hair from root to tip.',
    ingredients: ['African Bubbles Shampoo', 'Protein Deep Conditioner', 'Leave-In Conditioner', 'Hair Butter'],
    benefits: ['Reduces hair breakage and shedding', 'Strengthens weak, damaged strands', 'Improves moisture retention', 'Restores hair elasticity'],
    usage: 'Cleanse with Shampoo, Repair with Protein Conditioner, Moisturize with Leave-In, Seal with Hair Butter.',
    suitableFor: ['Hair that breaks easily', 'Dry or brittle hair', 'Transitioning or recovering from damage', 'Struggling with length retention'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. If contact occurs, rinse thoroughly with water. Do a patch test before full use if you have a sensitive scalp or allergies. Do not overuse protein treatments—balance with proper moisturizing routine. Discontinue use if irritation occurs. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'How often should I use this combo?', answer: 'We recommend using once a month depending on your hair condition.' },
      { question: 'Can I use this combo on natural, relaxed, or transitioning hair?', answer: 'Yes. This combo is designed for all hair types and textures, especially hair prone to breakage.' },
      { question: 'Will the protein treatment make my hair stiff?', answer: 'No. When used correctly and followed with moisture products in the combo, it strengthens without leaving hair hard or brittle.' },
      { question: 'Do I need to use heat with the deep conditioner?', answer: 'Heat is optional but recommended for deeper penetration. You can use a shower cap or hooded dryer if available.' },
      { question: 'Can I use other products alongside this combo?', answer: 'Yes, but avoid overloading your hair. This combo is already a complete strengthening and moisture system.' },
      { question: 'When will I start seeing results?', answer: 'Most users notice reduced breakage and softer hair after 2–3 uses with consistent routine.' }
    ]
  },
  {
    name: 'Moisture Boost Combo',
    price: 35000,
    categoryName: 'Kits & Bundles',
    description: 'If your hair feels dry, rough, dull, or constantly thirsty, this combo is your hydration reset.',
    ingredients: ['African Bubbles Shampoo', 'Moisturizing Deep Conditioner', 'Leave-In Conditioner', 'Hair Butter', 'Tea Mist'],
    benefits: ['Deeply restores moisture', 'Improves softness, slip, and manageability', 'Keeps hair hydrated for longer periods'],
    usage: 'Cleanse, Deep Hydrate, Moisturize & Detangle, Seal in Moisture, Refresh Between Wash Days with Tea Mist.',
    suitableFor: ['Chronically dry hair', 'Tangles and rough texture', 'Hair that loses moisture quickly after wash day', 'Needs full moisture routine'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. If contact occurs, rinse immediately with water. Do a patch test before full use if you have a sensitive scalp or known allergies. Do not over-apply product to avoid buildup, especially with the hair butter. Discontinue use if irritation occurs. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'How often should I use this combo?', answer: 'Use the full routine every 1–2x monthly. The Ayurvedic Tea Mist can be used daily or as needed between wash days.' },
      { question: 'Is this suitable for all hair types?', answer: 'Yes. It is formulated for natural, relaxed, transitioning, curly, coily, and wavy hair textures.' },
      { question: 'Can I use this if my hair is not very dry?', answer: 'Yes. It helps maintain moisture balance and prevents future dryness and breakage.' },
      { question: 'Will the hair butter weigh my hair down?', answer: 'No. When used in small amounts, it seals moisture without heaviness or buildup.' },
      { question: 'Can I use heat with the deep conditioner?', answer: 'Yes, heat is optional but recommended for deeper moisture penetration.' },
      { question: 'How quickly will I see results?', answer: 'Many users notice softer, more hydrated hair after the first use, with improved moisture retention after consistent use.' }
    ]
  },
  {
    name: 'Basic Essential Care Kit',
    price: 35000,
    categoryName: 'Kits & Bundles',
    description: 'A simple but effective routine that covers everything your hair needs to cleanse, nourish, hydrate, and seal.',
    ingredients: ['African Bubbles Shampoo', 'Moisturizing Deep Conditioner', 'Leave-In Conditioner', 'Hair Butter', 'Wild Growth Oil'],
    benefits: ['Supports healthy hair growth', 'Improves moisture balance', 'Simplifies your complete hair care routine'],
    usage: 'Follow the 5-step wash day and daily maintenance routine for optimal hair health.',
    suitableFor: ['Beginners', 'Minimal routines', 'Anyone who wants healthy hair without confusion'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. If contact occurs, rinse immediately with clean water. Do a patch test before full use if you have a sensitive scalp or allergies. Do not over-apply oil or butter to avoid buildup. Discontinue use if irritation occurs. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'How often should I use this kit?', answer: 'Use the full routine every 2-4weeks. The Wild Growth Oil can be used 2–4 times weekly depending on your scalp needs.' },
      { question: 'Is this kit suitable for all hair types?', answer: 'Yes. It works for natural, relaxed, transitioning, curly, coily, and wavy hair.' },
      { question: 'Can I use the oil on dirty hair?', answer: 'It is best applied to a clean or lightly damp scalp for better absorption, but it can also be used between wash days.' },
      { question: 'Will the hair butter make my hair greasy?', answer: 'No. When used in small amounts, it seals moisture without heaviness or buildup.' },
      { question: 'When will I see results?', answer: 'Many users notice softer, more manageable hair within 1–2 uses, with stronger results over consistent use.' },
      { question: 'Can I use other products with this kit?', answer: 'Yes, but this kit already provides a complete routine, so additional products are optional.' }
    ]
  },
  {
    name: 'Premium Crown Kit',
    price: 75000,
    categoryName: 'Kits & Bundles',
    description: 'Our most advanced and all-inclusive hair care system—designed for serious hair transformation, long-term growth, and total strand recovery.',
    ingredients: ['African Bubbles Shampoo', 'Clarifying Shampoo', 'Moisturizing Deep Conditioner', 'Protein Deep Conditioner', 'Leave-In Conditioner (x2)', 'Hair Butter (x2)', 'Tea Mist (x2)', 'Wild Growth Oil'],
    benefits: ['Complete head-to-toe hair care system', 'Deep repair for damaged or weak hair', 'Supports stronger, healthier hair growth'],
    usage: 'Customize your wash day and daily routine based on your hair\'s specific needs using this comprehensive system.',
    suitableFor: ['Needs serious repair + moisture balance', 'Struggling with breakage, dryness, or slow growth', 'Wants salon-level results at home', 'Prefers a complete routine with no guesswork'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. If contact occurs, rinse immediately with clean water. Do a patch test before full use if you have sensitive scalp or allergies. Do not overuse protein treatment to avoid dryness or stiffness. Avoid excessive product layering to prevent buildup. Discontinue use if irritation occurs. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'How often should I use this kit?', answer: 'Wash day routine is recommended every 1-2 times monthly, depending on your hair needs. The oil and mist can be used multiple times weekly.' },
      { question: 'Do I need to use all products at once every wash?', answer: 'Not always. This is a full system—you can rotate protein and moisture treatments based on what your hair needs.' },
      { question: 'Can I use protein and deep conditioner together?', answer: 'No. Use them separately depending on your hair condition. Protein strengthens, while moisturizing conditioner restores hydration.' },
      { question: 'Is this kit suitable for all hair types?', answer: 'Yes. It is designed for natural, relaxed, transitioning, curly, coily, and wavy hair.' },
      { question: 'Will this cause protein overload?', answer: 'No, as long as protein treatment is used moderately (not every wash day). Balance it with moisture treatments.' },
      { question: 'When will I see results?', answer: 'Many users notice improved softness and manageability within the first use, with stronger, healthier results over consistent use.' }
    ]
  },
  {
    name: 'Edges Recovery Combo',
    price: 14000,
    categoryName: 'Kits & Bundles',
    description: 'A targeted care system designed to soothe the scalp, improve circulation, and support healthier-looking edge regrowth over time.',
    ingredients: ['Ayurvedic Tea Mist', 'Wild Growth Oil'],
    benefits: ['Supports healthier-looking edge regrowth', 'Improves scalp hydration', 'Helps reduce dryness and breakage around the hairline'],
    usage: 'Apply Tea Mist to hairline, massage gently, then seal with a small amount of Wild Growth Oil.',
    suitableFor: ['Thinning or breaking edges', 'Frequently uses wigs, braids, or tight styles', 'Dry or weak hairline', 'Trying to maintain healthy, full edges'],
    freeFrom: [],
    warning: 'For external use only. Avoid contact with eyes. If contact occurs, rinse immediately with clean water. Do a patch test before full use if you have sensitive skin or scalp conditions. Do not apply excessive oil to avoid buildup or clogged follicles. Discontinue use if irritation occurs. Store in a cool, dry place away from direct sunlight.',
    faqs: [
      { question: 'How often should I use this combo?', answer: 'You can use it daily or at least 3-4times weekly for consistent results.' },
      { question: 'How long before I see results?', answer: 'Results vary, but with consistent use, many people notice improved scalp health and stronger-looking edges within a few weeks.' },
      { question: 'Can I use this with braids, wigs, or protective styles?', answer: 'Yes. It is especially effective for maintaining edges while wearing protective styles.' },
      { question: 'Will it grow back my edges?', answer: 'It supports a healthier scalp environment and stronger-looking regrowth, especially when thinning is due to dryness or tension. Results depend on consistency and cause of hair loss.' },
      { question: 'Can I use too much oil?', answer: 'No. Use a small amount only—too much can cause buildup and block absorption.' },
      { question: 'Is it suitable for all hair types?', answer: 'Yes. It works for all hair textures and is safe for regular use.' }
    ]
  }
];

const categoryImages: Record<string, string> = {
  'Shampoos': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
  'Conditioners': 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400',
  'Styling & Sealing': 'https://images.unsplash.com/photo-1559181567-c3190ca9be5b?w=400',
  'Scalp & Hair Treatments': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
  'Kits & Bundles': 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function importProducts() {
  await connectDB();
  console.log('🌱 Deleting existing products and importing fully detailed products...');

  // Wipe existing products to refresh the DB
  await Product.deleteMany({});

  // Create categories if they don't exist
  const categoryNames = [...new Set(productsData.map(p => p.categoryName))];
  const categoryMap = new Map();

  for (const name of categoryNames) {
    let category = await Category.findOne({ name });
    if (!category) {
      category = await Category.create({
        name,
        slug: slugify(name),
        description: `Explore our collection of ${name.toLowerCase()}.`,
        image: categoryImages[name] || ''
      });
      console.log(`Created category: ${name}`);
    }
    categoryMap.set(name, category._id);
  }

  let count = 0;
  for (const item of productsData) {
    const slug = slugify(item.name);

    await Product.create({
      name: item.name,
      slug,
      price: item.price,
      description: item.description,
      ingredients: item.ingredients,
      benefits: item.benefits,
      usage: item.usage,
      suitableFor: item.suitableFor || [],
      freeFrom: item.freeFrom || [],
      warning: item.warning || '',
      faqs: item.faqs || [],
      images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'], // Placeholder image
      category: categoryMap.get(item.categoryName),
      stock: 100, // Default stock
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
    });
    console.log(`✅ Created product: ${item.name}`);
    count++;
  }

  console.log(`🎉 Imported ${count} new fully detailed products successfully!`);
  await mongoose.connection.close();
  process.exit(0);
}

importProducts().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
