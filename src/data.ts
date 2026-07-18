export interface PolicyConcept {
  id: string;
  name: string;
  definition: string;
  conditionForEffectiveness: string;
  marketImpact: {
    price: string;
    quantity: string;
    consumerSurplus: string;
    producerSurplus: string;
    totalSurplus: string;
    deadweightLoss: string;
  };
  explanationDetails: {
    title: string;
    content: string;
  }[];
}

export interface RealExample {
  title: string;
  policyType: string;
  location: string;
  description: string;
  economicAnalysis: string;
}

export interface MCQuestion {
  id: number;
  year?: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanations: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  topic: string;
}

export interface EssayQuestion {
  id: string;
  title: string;
  prompt: string;
  maxMarks: number;
  suggestedKeywords: string[];
  rubric: string[];
  officialModelPoints: string[];
}

export const POLICY_CONCEPTS: PolicyConcept[] = [
  {
    id: "price-ceiling",
    name: "Price Ceiling (最高限價)",
    definition: "A price ceiling is a legally established maximum price that sellers are allowed to charge for a good or service.",
    conditionForEffectiveness: "It must be set BELOW the equilibrium price. If set above equilibrium, it is INEFFECTIVE as the market will simply trade at the lower equilibrium price.",
    marketImpact: {
      price: "Decreases to the price ceiling level.",
      quantity: "Decreases to the quantity supplied at the price ceiling level. A shortage (excess demand) arises.",
      consumerSurplus: "May increase or decrease depending on the elasticity of demand and the extent of the price reduction. Consumers who can purchase the good benefit, but others are shut out.",
      producerSurplus: "Decreases because producers receive a lower price and sell a smaller quantity.",
      totalSurplus: "Decreases due to underproduction (quantity transacted is below the efficient equilibrium quantity).",
      deadweightLoss: "Created because the marginal benefit of the last unit transacted is greater than its marginal cost (MB > MC)."
    },
    explanationDetails: [
      {
        title: "Inefficiency & Shortage",
        content: "Under an effective price ceiling, the quantity demanded exceeds the quantity supplied, resulting in a shortage. Since the market price cannot rise to clear the shortage, non-price rationing mechanisms must emerge (e.g., queuing, lottery systems, or black markets). This introduces secondary transaction costs."
      },
      {
        title: "Surplus Distribution & DWL",
        content: "Consumer surplus changes from the original triangle to a new trapezoid of benefit for the lucky buyers, while producer surplus shrinks to a small triangle. The missing triangle on the right side of the equilibrium point represents Deadweight Loss (DWL) — the mutually beneficial trades that are prevented from occurring."
      }
    ]
  },
  {
    id: "price-floor",
    name: "Price Floor (最低限價)",
    definition: "A price floor is a legally established minimum price that buyers must pay for a good or service.",
    conditionForEffectiveness: "It must be set ABOVE the equilibrium price. If set below equilibrium, it is INEFFECTIVE because the market will trade at the higher equilibrium price.",
    marketImpact: {
      price: "Increases to the price floor level.",
      quantity: "Decreases to the quantity demanded at the price floor level. A surplus (excess supply) arises.",
      consumerSurplus: "Decreases because consumers pay a higher price and buy a smaller quantity.",
      producerSurplus: "May increase or decrease depending on the elasticity of supply and the extent of the price floor. Producers who sell their goods benefit from higher prices, but others are left with unsold inventory.",
      totalSurplus: "Decreases due to underproduction (quantity transacted is reduced to the quantity demanded).",
      deadweightLoss: "Created because transactions are restricted, and the marginal benefit of the last unit transacted is greater than its marginal cost (MB > MC)."
    },
    explanationDetails: [
      {
        title: "Inefficiency & Surplus of Goods",
        content: "Under an effective price floor, the quantity supplied exceeds the quantity demanded, leading to an excess supply or surplus. Common examples include agricultural price supports or minimum wage laws (which can lead to a surplus of labor, i.e., unemployment)."
      },
      {
        title: "Why it is Inefficient",
        content: "Efficiency requires Marginal Benefit (MB) equals Marginal Cost (MC). Because the quantity transacted is reduced, there are units of output between the transacted quantity and the equilibrium quantity where MB > MC, but they are not produced. This results in underproduction and Deadweight Loss."
      }
    ]
  },
  {
    id: "quota",
    name: "Quota (配額)",
    definition: "A quota is a legally established maximum quantity of a good or service that can be bought or sold in a market.",
    conditionForEffectiveness: "It must be set BELOW the equilibrium quantity. If set above equilibrium, it is INEFFECTIVE because the market will simply trade at the lower equilibrium quantity.",
    marketImpact: {
      price: "Increases to the demand price (willingness to pay) at the quota quantity.",
      quantity: "Decreases to the quota level.",
      consumerSurplus: "Decreases because consumers pay a higher price and consume less.",
      producerSurplus: "Increases or decreases. The quota creates a 'quota rent' (the price premium) which is captured by the holders of the quota license, usually shifting surplus to sellers.",
      totalSurplus: "Decreases due to restricted transactions.",
      deadweightLoss: "Created because the quantity is restricted below equilibrium, leaving MB > MC."
    },
    explanationDetails: [
      {
        title: "The Kinked Supply Curve",
        content: "Under an effective quota, the supply curve becomes perfectly vertical at the quota quantity. The intersection of this vertical supply with the demand curve determines the market clearing price, which is higher than the original equilibrium price."
      },
      {
        title: "Quota Rent",
        content: "Quota Rent is the difference between the demand price and the supply price at the quota level: (Pd - Ps). It represents a transfer of surplus from consumers to quota license holders. The remaining uncaptured potential surplus between the quota level and equilibrium represents the Deadweight Loss."
      }
    ]
  },
  {
    id: "tax",
    name: "Per Unit Tax (從量稅)",
    definition: "A per-unit tax is a fixed levy imposed by the government on each unit of a good sold.",
    conditionForEffectiveness: "Always effective. It shifts the supply curve vertically upwards by the amount of the tax.",
    marketImpact: {
      price: "Price paid by consumers (Pc) increases; price received by producers (Pp) decreases.",
      quantity: "Decreases as the higher consumer price reduces the quantity demanded.",
      consumerSurplus: "Decreases because consumers pay a higher price and buy less.",
      producerSurplus: "Decreases because producers receive a lower net price and sell less.",
      totalSurplus: "Decreases. It equals Consumer Surplus + Producer Surplus + Government Tax Revenue. Since TSS is lower than equilibrium, efficiency is lost.",
      deadweightLoss: "Created because the tax drives a wedge between the price consumers pay and the price producers receive, reducing the quantity below the efficient level."
    },
    explanationDetails: [
      {
        title: "Tax Burden & Elasticity",
        content: "The burden of the tax is shared between consumers and producers. The ratio of their tax burdens depends on the relative price elasticities of demand and supply. The more inelastic side of the market bears a larger share of the tax burden."
      },
      {
        title: "Government Revenue vs. DWL",
        content: "The government collects a rectangle of Tax Revenue (Tax * Qt). However, because quantity falls from Q* to Qt, the triangle representing trades that no longer occur constitutes the Deadweight Loss. The tax creates underproduction where MB > MC at the net-of-tax level."
      }
    ]
  },
  {
    id: "subsidy",
    name: "Per Unit Subsidy (從量津貼)",
    definition: "A per-unit subsidy is a payment by the government to buyers or sellers for each unit of a good transacted.",
    conditionForEffectiveness: "Always effective. It shifts the supply curve vertically downwards by the amount of the subsidy.",
    marketImpact: {
      price: "Price paid by consumers (Pc) decreases; price received by producers (Pp, including subsidy) increases.",
      quantity: "Increases because the lower consumer price stimulates quantity demanded.",
      consumerSurplus: "Increases because consumers pay a lower price and buy more.",
      producerSurplus: "Increases because producers receive a higher price (including subsidy) and sell more.",
      totalSurplus: "Decreases. It equals Consumer Surplus + Producer Surplus - Government Subsidy Expenditure. Since the subsidy cost exceeds the gains in CS and PS, TSS falls.",
      deadweightLoss: "Created due to OVERPRODUCTION. Units of output beyond the equilibrium quantity are produced where the marginal cost to society is greater than the marginal benefit (MC > MB)."
    },
    explanationDetails: [
      {
        title: "The Cost of Overproduction",
        content: "Subsidies are often popular because both consumers and producers appear to gain (higher CS and PS). However, these gains are artificially financed by taxpayers. The total subsidy expenditure by the government is larger than the sum of the gains in CS and PS, meaning society as a whole loses."
      },
      {
        title: "Deadweight Loss from Subsidy",
        content: "For each unit produced beyond the equilibrium quantity Q*, the Marginal Cost of production is higher than the Marginal Benefit of consumption. Society is wasting resources on producing goods that are valued less than their production cost. This creates a right-pointing DWL triangle."
      }
    ]
  }
];

export const REAL_EXAMPLES: RealExample[] = [
  {
    title: "Rent Frozen Bill in Berlin (租金凍結)",
    policyType: "Price Ceiling",
    location: "Berlin, Germany",
    description: "In 2020, the Berlin government implemented a 'Rent Frozen Bill' (Mietendeckel), freezing rents for 5 years to combat soaring housing costs.",
    economicAnalysis: "While it aimed to protect low-income tenants, it created an effective price ceiling. The quantity of apartments supplied for rent dropped sharply as landlords withdrew apartments from the market, converted them to private sales, or stopped maintenance. A severe housing shortage arose, leading to long queues and shadow markets."
  },
  {
    title: "Statutory Minimum Wage in Hong Kong (法定最低工資)",
    policyType: "Price Floor",
    location: "Hong Kong",
    description: "Hong Kong introduced the statutory minimum wage in 2011 to ensure a basic income level for low-skilled workers.",
    economicAnalysis: "The minimum wage acts as a price floor in the labor market. When set above the equilibrium wage for low-skilled jobs, it causes the quantity of labor supplied to exceed the quantity demanded. This can lead to unemployment among the least skilled, youngest, or elderly workers, as employers cut back on hiring or substitute labor with technology (e.g., self-service kiosks in fast-food chains)."
  },
  {
    title: "Taxi Fare Adjustments in Hong Kong (的士收費調整)",
    policyType: "Price Ceiling",
    location: "Hong Kong",
    description: "The Hong Kong Government regulates taxi fares. When the urban taxi flag-fall was raised from $18 to $20, it changed the legal price ceiling.",
    economicAnalysis: "Taxi fares are a regulated price ceiling. When the ceiling is raised closer to the market clearing price, the shortage of taxi rides decreases, and deadweight loss is reduced. For long-distance trips, the relative price adjusted, affecting consumer surplus and the allocation of taxis between short and long rides (DSE 2012 Q14)."
  },
  {
    title: "Vehicle License Quotas in Singapore (車輛配額制度 - COE)",
    policyType: "Quota",
    location: "Singapore",
    description: "To manage traffic congestion, Singapore limits the number of new vehicles registered each year through the Certificate of Entitlement (COE) quota system.",
    economicAnalysis: "This is a classic effective quota. The fixed quota of vehicle permits shifts the supply curve of cars to a vertical line at the quota level. This drives up the price of COE permits (which represents a quota rent) to astronomical heights. It effectively reduces car ownership, resulting in a large deadweight loss in the car market, but transfers surplus to the government as quota rent."
  },
  {
    title: "Plastic Shopping Bag Charging Scheme (塑膠購物袋收費)",
    policyType: "Per Unit Tax",
    location: "Hong Kong",
    description: "In Hong Kong, retailers are legally required to charge at least HK$1 for each plastic shopping bag provided to customers.",
    economicAnalysis: "This levy acts as a per-unit tax on plastic bags. It shifts the supply curve of bags upward. Consumers face a higher price, causing the quantity demanded and transacted to drop by over 80%. While it creates a small deadweight loss in the bag market, it is intended to correct a negative externality (environmental pollution) by aligning private costs with social costs."
  },
  {
    title: "Seasonal Influenza Vaccination Subsidy (季節性流感疫苗資助)",
    policyType: "Per Unit Subsidy",
    location: "Hong Kong",
    description: "The Hong Kong Government provides a per-unit cash subsidy (e.g., HK$260) for children, elderly, and high-risk groups to receive flu vaccines at private clinics.",
    economicAnalysis: "The vaccination subsidy shifts the supply curve of private clinic vaccinations downwards. It lowers the price paid by consumers and increases the net price received by doctors, raising the total quantity of vaccinations. Although in a simple competitive market a subsidy creates deadweight loss from overproduction, here it is used to correct a positive externality (herd immunity), which actually improves efficiency."
  }
];

export const MC_QUESTIONS: MCQuestion[] = [
  {
    id: 1,
    year: "DSE 2014 A3 (Modified)",
    question: "Suppose the government raises an effective price floor in the market of Good X. What will happen to the quantity transacted and the deadweight loss?",
    options: {
      A: "Quantity transacted will increase, and deadweight loss will decrease.",
      B: "Quantity transacted will decrease, and deadweight loss will increase.",
      C: "Quantity transacted will remain unchanged, and deadweight loss will increase.",
      D: "Both quantity transacted and deadweight loss will remain unchanged."
    },
    correctAnswer: "B",
    explanations: {
      A: "Incorrect. Raising an effective price floor increases the price further above equilibrium, which reduces quantity demanded. Since quantity transacted is determined by the short side of the market (demand), quantity transacted must decrease, and deadweight loss will expand.",
      B: "Correct. Since the price floor is effective, raising it increases the price. Consumers will reduce their quantity demanded. The quantity transacted (determined by demand) falls further below the equilibrium level, increasing the gap between MB and MC and thus expanding the deadweight loss.",
      C: "Incorrect. The quantity transacted cannot remain unchanged because the higher price causes a contraction of demand along the demand curve.",
      D: "Incorrect. This would only be true if the price floor was ineffective (set below the equilibrium price) both before and after the change."
    },
    topic: "Price Floor"
  },
  {
    id: 2,
    year: "DSE 2012 Q19",
    question: "The increase of an effective quota on a good will result in:\n(1) an increase in the quantity transacted of the good.\n(2) a further improvement in the quality of the good.\n(3) a smaller deadweight loss.",
    options: {
      A: "(1) and (2) only",
      B: "(1) and (3) only",
      C: "(2) and (3) only",
      D: "(1), (2) and (3)"
    },
    correctAnswer: "B",
    explanations: {
      A: "Incorrect. Point (2) refers to the 'Alchian-Allen effect' where a fixed transaction cost improves average quality, but an increase in quota (relaxing the restriction) does not lead to a further quality upgrade.",
      B: "Correct. An increase in an effective quota means the government allows more quantity to be transacted. This moves the transacted quantity closer to the equilibrium quantity, increasing the transacted quantity (1) and reducing the deadweight loss (3).",
      C: "Incorrect. Point (1) is definitely correct as a relaxed quota allows more imports or sales.",
      D: "Incorrect. Point (2) is incorrect because relaxing a quota reduces the price premium, which does not improve quality further."
    },
    topic: "Quota"
  },
  {
    id: 3,
    year: "DSE 2021 Q17",
    question: "Refer to the following diagram: initially, an effective price ceiling is set at P1. If the government lowers the price ceiling from P1 to P2, which of the following statements is correct?",
    options: {
      A: "The producer surplus will increase.",
      B: "The consumer surplus will definitely increase.",
      C: "The total social surplus will decrease, and deadweight loss will increase.",
      D: "The excess supply of the good will increase."
    },
    correctAnswer: "C",
    explanations: {
      A: "Incorrect. Lowering the price ceiling reduces the price producers can receive, which reduces their quantity supplied. Producer surplus must decrease.",
      B: "Incorrect. Lowering the price ceiling has two opposing effects on consumer surplus: consumers who still buy the good pay less (gain), but fewer units are available for sale (loss). Thus, CS can increase or decrease.",
      C: "Correct. Lowering the price ceiling reduces the quantity supplied, which is the transacted quantity. This drives the quantity further away from the efficient equilibrium quantity, thereby reducing total social surplus and increasing the deadweight loss.",
      D: "Incorrect. A price ceiling creates excess demand (shortage), not excess supply (surplus)."
    },
    topic: "Price Ceiling"
  },
  {
    id: 4,
    year: "DSE 2020 Q20",
    question: "The provision of a per-unit production subsidy on a good in a competitive market with typical demand and supply curves will lead to:",
    options: {
      A: "A fall in the producer surplus of the good.",
      B: "A rise in consumers' total expenditure on the good.",
      C: "A rise in the total social surplus of the good.",
      D: "A rise in the total revenue of producers, including the subsidy."
    },
    correctAnswer: "D",
    explanations: {
      A: "Incorrect. A subsidy shifts the supply curve down. The price received by producers (including the subsidy) increases, and the quantity transacted increases. Therefore, producer surplus must rise.",
      B: "Incorrect. Consumers' total expenditure is Pc * Q. Since price falls and quantity rises, expenditure can increase, decrease, or remain unchanged, depending on the price elasticity of demand.",
      C: "Incorrect. A subsidy in a perfectly competitive market leads to overproduction, creating a deadweight loss. Thus, total social surplus (CS + PS - Subsidy cost) decreases.",
      D: "Correct. Producers receive the consumer price plus the subsidy (Pp = Pc + s), which is higher than the original equilibrium price. The transacted quantity also increases. Therefore, their total revenue (including the subsidy), which is Pp * Q, must increase."
    },
    topic: "Per Unit Subsidy"
  },
  {
    id: 5,
    year: "DSE 2024 Q20",
    question: "Suppose the government increases the per-unit subsidy from $5 to $10. Which of the following statements about deadweight loss is correct?",
    options: {
      A: "The deadweight loss remains unchanged.",
      B: "The deadweight loss decreases because more units are produced.",
      C: "The deadweight loss increases due to a greater degree of overproduction.",
      D: "The deadweight loss turns into a social benefit."
    },
    correctAnswer: "C",
    explanations: {
      A: "Incorrect. The deadweight loss must change because the level of subsidy changes the gap between MC and MB.",
      B: "Incorrect. More units being produced beyond equilibrium increases inefficiency because for those extra units, MC > MB.",
      C: "Correct. Increasing the subsidy shifts the supply curve down further, leading to a higher transacted quantity far beyond the efficient equilibrium quantity. This causes a larger degree of overproduction, driving a wider gap where MC > MB and expanding the deadweight loss.",
      D: "Incorrect. Deadweight loss is always a net loss in social welfare, never a social benefit."
    },
    topic: "Per Unit Subsidy"
  }
];

export const ESSAY_QUESTIONS: EssayQuestion[] = [
  {
    id: "ceil-lower",
    title: "DSE 2012 A5(c) - Price Ceiling Reduction",
    prompt: "An effective price ceiling is set on Good X. Suppose the government lowers the price ceiling further. With the aid of a supply-demand diagram, explain whether this change will improve economic efficiency.",
    maxMarks: 4,
    suggestedKeywords: ["effective price ceiling", "quantity supplied", "underproduction", "deadweight loss", "marginal benefit", "marginal cost"],
    rubric: [
      "Identifies that the transacted quantity is determined by quantity supplied under an effective price ceiling.",
      "Explains that lowering the price ceiling causes quantity supplied (and thus transacted quantity) to decrease further.",
      "States that transacted quantity moves further away from the efficient equilibrium quantity (underproduction worsens).",
      "Concludes that economic efficiency worsens / deadweight loss increases, because for the lost units, the marginal benefit is greater than the marginal cost (MB > MC)."
    ],
    officialModelPoints: [
      "An effective price ceiling is set below the equilibrium price. Under this policy, the quantity transacted is equal to the quantity supplied.",
      "When the price ceiling is lowered, the price producers can charge decreases, which causes a contraction in quantity supplied. Therefore, the quantity transacted decreases further.",
      "Since the quantity transacted was already below the efficient equilibrium level (underproduction), lowering the ceiling moves the transacted quantity even further away from the equilibrium.",
      "The deadweight loss increases because mutually beneficial trades where Marginal Benefit (MB) exceeds Marginal Cost (MC) are further restricted. Thus, economic efficiency is reduced."
    ]
  },
  {
    id: "floor-wage",
    title: "DSE 2018 B10(c) - Price Floor Inefficiency",
    prompt: "Suppose the government implements an effective statutory minimum wage in the labor market. Explain how this policy leads to economic inefficiency.",
    maxMarks: 4,
    suggestedKeywords: ["effective price floor", "minimum wage", "quantity demanded", "underproduction", "deadweight loss", "marginal benefit", "marginal cost"],
    rubric: [
      "Identifies the minimum wage as an effective price floor set above the equilibrium wage.",
      "Explains that quantity demanded for labor determines the transacted quantity under an effective price floor.",
      "Explains that the transacted quantity of labor is reduced below the equilibrium level.",
      "Concludes that a deadweight loss is created because for the units of labor between the transacted level and equilibrium, the marginal benefit (marginal revenue product) is greater than the marginal cost (wage rate required by workers)."
    ],
    officialModelPoints: [
      "A statutory minimum wage is an effective price floor set above the equilibrium wage rate.",
      "At this higher wage, the quantity of labor supplied exceeds the quantity demanded, leading to a surplus of labor (unemployment).",
      "The quantity of labor actually employed (transacted quantity) is determined by the quantity demanded, which is lower than the equilibrium quantity.",
      "Since quantity transacted is restricted below the efficient level, underproduction of labor services occurs. A deadweight loss is created because for the foregone employment units, the marginal benefit to employers is greater than the marginal cost of work to employees (MB > MC)."
    ]
  },
  {
    id: "subsidy-ineff",
    title: "DSE 2017 B11(b) - Subsidy Inefficiency",
    prompt: "A government introduces a per-unit subsidy to private university education. Defend the statement: 'The subsidy causes economic inefficiency even though both students and universities benefit.'",
    maxMarks: 4,
    suggestedKeywords: ["per-unit subsidy", "overproduction", "marginal cost", "marginal benefit", "deadweight loss", "taxpayers' cost"],
    rubric: [
      "States that both students (consumers) and universities (producers) benefit because of higher consumer surplus and producer surplus.",
      "Explains that the subsidy increases the transacted quantity of education services beyond the efficient equilibrium quantity.",
      "Explains that for these additional units produced beyond equilibrium, the marginal cost (MC) is greater than the marginal benefit (MB).",
      "Concludes that a deadweight loss is created because the total subsidy cost borne by taxpayers exceeds the combined gains in consumer and producer surplus."
    ],
    officialModelPoints: [
      "A per-unit subsidy reduces the price paid by students (increasing consumer surplus) and increases the price received by universities (increasing producer surplus). Thus, both parties appear to benefit.",
      "However, the subsidy stimulates production, driving the transacted quantity beyond the competitive equilibrium quantity (overproduction).",
      "For these extra units of education transacted, the Marginal Cost of production (MC) is higher than the Marginal Benefit of consumption (MB).",
      "The total subsidy expenditure paid by the government (taxpayers) is greater than the sum of the increase in consumer and producer surplus. This net loss to society is the deadweight loss, demonstrating that the policy is economically inefficient."
    ]
  }
];
