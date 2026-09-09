import hashlib
import json
from pathlib import Path

from PIL import Image

from app.ai.base import AIService

WASTE_RESPONSES = {
    "pizza_box": {
        "category": "paper",
        "material": "Corrugated cardboard (soiled)",
        "recyclable": False,
        "confidence": 0.88,
        "disposal_method": "Compost or general waste if heavily soiled with grease/food. Clean sections can be recycled.",
        "environmental_tip": "Pizza boxes are often contaminated with grease which makes them non-recyclable. Consider composting them or tearing off clean portions for recycling.",
        "safety_warning": None,
    },
    "battery": {
        "category": "hazardous",
        "material": "Lithium-ion battery",
        "recyclable": False,
        "confidence": 0.95,
        "disposal_method": "Do NOT dispose in regular trash. Take to designated battery recycling drop-off points at electronics stores or municipal collection centers.",
        "environmental_tip": "Batteries contain heavy metals and toxic chemicals that can leach into soil and groundwater. Never throw batteries in regular trash.",
        "safety_warning": "Damaged lithium batteries can pose fire risks. Handle with care and do not puncture or crush.",
    },
    "plastic_bottle": {
        "category": "plastic",
        "material": "PET (Polyethylene Terephthalate) - #1 plastic",
        "recyclable": True,
        "confidence": 0.97,
        "disposal_method": "Rinse and place in recycling bin. Remove cap if required by local guidelines.",
        "environmental_tip": "PET bottles can be recycled into new bottles, clothing fibers, or carpet. One recycled bottle saves enough energy to power a lightbulb for 3 hours.",
        "safety_warning": None,
    },
    "aluminum_can": {
        "category": "metal",
        "material": "Aluminum",
        "recyclable": True,
        "confidence": 0.99,
        "disposal_method": "Rinse and place in metal/aluminum recycling bin.",
        "environmental_tip": "Aluminum is infinitely recyclable. Recycling aluminum cans uses 95% less energy than producing new aluminum from bauxite ore.",
        "safety_warning": None,
    },
    "glass_bottle": {
        "category": "glass",
        "material": "Soda-lime glass",
        "recyclable": True,
        "confidence": 0.96,
        "disposal_method": "Rinse and place in glass recycling bin. Separate by color if required locally.",
        "environmental_tip": "Glass can be recycled endlessly without loss of quality. Each recycled glass container saves enough energy to power a computer for 30 minutes.",
        "safety_warning": "Handle broken glass carefully. Wrap in newspaper before disposal to protect waste handlers.",
    },
    "organic_waste": {
        "category": "organic",
        "material": "Food waste / Organic matter",
        "recyclable": True,
        "confidence": 0.92,
        "disposal_method": "Compost in backyard compost bin or municipal green waste collection.",
        "environmental_tip": "Food waste in landfills produces methane, a potent greenhouse gas. Composting diverts waste and creates nutrient-rich soil amendment.",
        "safety_warning": None,
    },
    "ewaste": {
        "category": "electronic",
        "material": "Electronic components (mixed metals, plastics, circuit boards)",
        "recyclable": True,
        "confidence": 0.90,
        "disposal_method": "Take to certified e-waste recycling facility. Many retailers offer take-back programs.",
        "environmental_tip": "E-waste contains valuable recoverable materials including gold, silver, copper, and rare earth elements. Proper recycling recovers these resources.",
        "safety_warning": "E-waste may contain lead, mercury, cadmium, and other hazardous materials. Never dispose in regular trash.",
    },
    "textile": {
        "category": "textile",
        "material": "Cotton/polyester blend fabric",
        "recyclable": True,
        "confidence": 0.85,
        "disposal_method": "Donate wearable items to thrift stores. Textile recycling bins accept worn-out clothing.",
        "environmental_tip": "The fashion industry accounts for 10% of global carbon emissions. Extending clothing life by 9 months reduces its environmental impact by 20-30%.",
        "safety_warning": None,
    },
    "styrofoam": {
        "category": "plastic",
        "material": "Expanded polystyrene (EPS) - #6 plastic",
        "recyclable": False,
        "confidence": 0.94,
        "disposal_method": "Most curbside programs do not accept Styrofoam. Check for drop-off locations or place in general waste.",
        "environmental_tip": "Styrofoam takes over 500 years to decompose and is rarely recycled. Consider using reusable containers instead.",
        "safety_warning": None,
    },
    "paper": {
        "category": "paper",
        "material": "Mixed paper / newspaper",
        "recyclable": True,
        "confidence": 0.98,
        "disposal_method": "Place in paper recycling bin. Remove any plastic wrapping or tape.",
        "environmental_tip": "Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 3 cubic yards of landfill space.",
        "safety_warning": None,
    },
    "diaper": {
        "category": "mixed",
        "material": "Absorbent polymer / cellulose blend",
        "recyclable": False,
        "confidence": 0.93,
        "disposal_method": "Seal in a bag and dispose in general waste. Not recyclable or compostable in standard programs.",
        "environmental_tip": "Consider reusable cloth diapers which can reduce waste by up to 50% over a child's diapering years.",
        "safety_warning": "Dispose of soiled diapers promptly to maintain hygiene.",
    },
    "default_plastic": {
        "category": "plastic",
        "material": "Mixed plastic polymer",
        "recyclable": False,
        "confidence": 0.75,
        "disposal_method": "Check local recycling guidelines. If the plastic number is not accepted curbside, dispose in general waste.",
        "environmental_tip": "Only about 9% of all plastic ever produced has been recycled. Choosing products with minimal packaging helps reduce plastic waste.",
        "safety_warning": None,
    },
    "default_paper": {
        "category": "paper",
        "material": "Paper product",
        "recyclable": True,
        "confidence": 0.80,
        "disposal_method": "Place in paper recycling if clean and dry. Soiled paper should go in general waste or compost.",
        "environmental_tip": "Paper can be recycled 5-7 times before fibers become too short. Choose recycled paper products to support the circular economy.",
        "safety_warning": None,
    },
    "default_metal": {
        "category": "metal",
        "material": "Ferrous or non-ferrous metal",
        "recyclable": True,
        "confidence": 0.82,
        "disposal_method": "Place in metal recycling bin. Clean containers are preferred.",
        "environmental_tip": "Metals are among the most recyclable materials. Recycling steel uses 60% less energy than producing it from raw materials.",
        "safety_warning": None,
    },
    "default_organic": {
        "category": "organic",
        "material": "Organic matter",
        "recyclable": True,
        "confidence": 0.78,
        "disposal_method": "Compost if possible, otherwise dispose in general waste.",
        "environmental_tip": "Organic waste makes up about 30% of household waste. Composting at home can significantly reduce your landfill contribution.",
        "safety_warning": None,
    },
}

CHAT_RESPONSES = {
    "pizza box": "Pizza boxes are tricky! If they're clean and free of grease, they can be recycled with cardboard. However, most pizza boxes have grease stains which contaminate the recycling stream. The best option is to compost soiled portions or tear off the clean lid for recycling while composting or trashing the greasy bottom. Pro tip: some communities now accept greasy cardboard in composting programs!",
    "battery": "Batteries should NEVER go in regular trash! They contain heavy metals and chemicals that can harm the environment. Take them to designated collection points - many electronics stores, hardware stores, and municipal recycling centers accept batteries. Common drop-off locations include Best Buy, Home Depot, and Staples. For lithium batteries specifically, tape the terminals before recycling to prevent fire hazards.",
    "plastic": "Plastic recycling depends on the resin type (look for the number inside the recycling symbol). #1 PET (water bottles) and #2 HDPE (milk jugs) are most widely accepted. Avoid putting plastic bags in curbside bins - return them to grocery store collection points. Reducing plastic use is even better than recycling! Consider reusable water bottles, cloth bags, and beeswax wraps as alternatives.",
    "recycling": "Recycling basics: Rinse containers, don't bag recyclables (unless your program requires it), check local guidelines as they vary by municipality. Common mistakes include recycling greasy pizza boxes, putting plastic bags in bins, and wish-cycling (throwing non-recyclables in hoping they'll be recycled). When in doubt, check your local waste management website!",
    "compost": "Composting is one of the best things you can do for the environment! Start with fruit/vegetable scraps, coffee grounds, eggshells, and yard waste. Avoid meat, dairy, and oily foods in backyard compost. You can compost at home in a bin or pile, or use municipal green waste collection. Compost reduces methane from landfills and creates nutrient-rich soil for gardens.",
    "e-waste": "Electronic waste (e-waste) contains both valuable and hazardous materials. Never throw electronics in regular trash! Use manufacturer take-back programs, retailer recycling programs (Best Buy, Apple), or certified e-waste recyclers. Many items can be donated if still working. E-waste contains gold, silver, copper, and rare earth metals that can be recovered through proper recycling.",
    "reduce": "The most impactful environmental action is reducing consumption. Before buying, ask: Do I really need this? Can I borrow or rent instead? Can I buy secondhand? Choose products with minimal packaging, buy in bulk, and opt for durable goods over disposable ones. Reducing consumption saves resources, energy, and money while decreasing waste generation.",
    "sustainable": "Living sustainably is about making conscious choices. Start with small changes: bring reusable bags, use a water bottle, choose products with eco-labels, support local producers, reduce meat consumption, and compost food waste. Every small action adds up. Remember: progress over perfection - you don't have to be perfect to make a difference!",
    "sdg 12": "SDG 12 (Responsible Consumption and Production) aims to ensure sustainable consumption and production patterns. Key targets include reducing food waste, achieving environmentally sound management of chemicals and wastes, substantially reducing waste generation through prevention, reduction, recycling, and reuse, and encouraging companies to adopt sustainable practices. Everyone can contribute by making informed purchasing choices and reducing waste.",
    "hazardous": "Hazardous household waste includes batteries, paint, chemicals, pesticides, fluorescent bulbs, and medical waste. These require special handling and cannot go in regular trash or recycling. Contact your local waste management authority for collection events or drop-off locations. Store hazardous materials safely at home and never mix different chemicals together.",
    "plastic bag": "Plastic bags are a major environmental problem - they take hundreds of years to decompose and harm wildlife. Most curbside programs DON'T accept plastic bags because they jam sorting machinery. Return clean bags to grocery store collection bins. Better yet: switch to reusable bags! It takes about 713 plastic bags to make one pound of recycled plastic, and only about 5% are actually recycled.",
    "food waste": "Food waste is a massive global problem - about one-third of all food produced is wasted. Reduce food waste by: planning meals, buying only what you need, storing food properly, using leftovers creatively, and composting unavoidable waste. In landfills, food waste produces methane, a greenhouse gas 25 times more potent than CO2. Composting food waste is the single best thing you can do to reduce your household's climate impact!",
    "water": "Water conservation is crucial for sustainability. Simple steps: fix leaky faucets (they can waste 3,000 gallons per year), take shorter showers, use water-efficient appliances, collect rainwater for gardening, and choose drought-resistant plants. Water treatment and distribution uses significant energy, so conserving water also reduces your carbon footprint.",
    "energy": "Reducing energy consumption benefits both the environment and your wallet. Tips: switch to LED bulbs (use 75% less energy), unplug electronics when not in use, use programmable thermostats, improve home insulation, and choose energy-efficient appliances. Consider renewable energy options like solar panels or green energy providers.",
    "packaging": "Excessive packaging is a major waste issue. Choose products with minimal or recyclable packaging. Look for package-free options at bulk stores. Avoid single-use packaging when possible. Support companies that use sustainable packaging. Remember: the most sustainable packaging is no packaging at all!",
    "clothing": "Fast fashion is one of the most polluting industries. Sustainable alternatives: buy secondhand, choose quality over quantity, repair clothes instead of discarding, donate wearable items, and recycle textiles that can't be repaired. Extending clothing life by just 9 months reduces its environmental impact by 20-30%. Consider capsule wardrobes and natural fiber clothing.",
    "diaper": "Disposable diapers take about 500 years to decompose in landfills. A single child uses approximately 6,000-8,000 diapers before potty training. Alternatives include cloth diapers (which can be washed and reused), biodegradable disposable diapers, or hybrid systems. While cloth diapers require water and energy for washing, they still have a lower overall environmental impact than disposables.",
    "glass": "Glass is one of the most sustainable packaging materials - it's made from abundant natural materials (sand, soda ash, limestone) and is infinitely recyclable without quality loss. Recycled glass (cullet) melts at lower temperatures, saving energy. Rinse glass containers before recycling. Separate by color where required. Note: ceramics, mirrors, and window glass have different compositions and usually can't be recycled with bottles and jars.",
    "metal": "Metals are sustainability champions - they can be recycled indefinitely without losing quality. Aluminum recycling saves 95% of the energy needed to make new aluminum. Steel recycling saves 60%. Rinse cans and remove caps if required. Even small items like bottle caps can be recycled with the container. Metal recycling also reduces mining impacts and habitat destruction.",
    "cardboard": "Cardboard is recyclable and biodegradable! Flatten boxes before recycling to save space. Remove tape, staples, and packing materials. Keep cardboard dry - wet cardboard may not be accepted. Cardboard can be recycled 5-7 times before fibers degrade. It's also great for composting (shredded cardboard is a good 'brown' material for compost bins). Always break down boxes to maximize bin space.",
}


def _hash_filename(filename: str) -> int:
    h = hashlib.md5(filename.lower().encode()).hexdigest()
    return int(h[:8], 16)


class DemoAIService(AIService):
    async def analyze_image(self, image_path: str, filename: str) -> dict:
        name_lower = filename.lower()
        file_hash = _hash_filename(filename)

        try:
            with Image.open(image_path) as img:
                width, height = img.size
                aspect_ratio = width / height if height > 0 else 1.0
        except Exception:
            width, height = 800, 600
            aspect_ratio = 4 / 3

        keyword_map = {
            "pizza": "pizza_box",
            "battery": "battery",
            "bottle": "plastic_bottle",
            "can": "aluminum_can",
            "glass": "glass_bottle",
            "organic": "organic_waste",
            "food": "organic_waste",
            "compost": "organic_waste",
            "electronic": "ewaste",
            "phone": "ewaste",
            "laptop": "ewaste",
            "computer": "ewaste",
            "textile": "textile",
            "cloth": "textile",
            "shirt": "textile",
            "styrofoam": "styrofoam",
            "paper": "paper",
            "newspaper": "paper",
            "cardboard": "paper",
            "diaper": "diaper",
        }

        selected_key = None
        for keyword, response_key in keyword_map.items():
            if keyword in name_lower:
                selected_key = response_key
                break

        if selected_key is None:
            categories = list(WASTE_RESPONSES.keys())
            default_keys = [k for k in categories if k.startswith("default_")]
            if default_keys:
                selected_key = default_keys[file_hash % len(default_keys)]
            else:
                selected_key = "plastic_bottle"

        response = WASTE_RESPONSES[selected_key].copy()
        variation = (file_hash % 10) / 100.0
        response["confidence"] = min(1.0, max(0.6, response["confidence"] + variation - 0.05))

        return response

    async def generate_response(self, prompt: str, context: str | None = None) -> str:
        prompt_lower = prompt.lower()

        for keyword, response in CHAT_RESPONSES.items():
            if keyword in prompt_lower:
                return response

        fallback = "That's a great sustainability question! Here are some general tips: Reduce your consumption by choosing products wisely, Reuse items whenever possible before discarding them, and Recycle materials according to your local guidelines. For specific questions about waste disposal, try asking about a particular material (plastic, paper, glass, metal, organic) or item type. Every small action contributes to a more sustainable future!"
        if context:
            fallback += f"\n\nBased on our knowledge base, here is some relevant context: {context[:500]}"
        return fallback

    async def classify_waste(self, image_path: str) -> dict:
        return await self.analyze_image(image_path, "classified_item")
