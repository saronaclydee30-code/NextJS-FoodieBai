export const promoDeals = [
  {
    code: "FOODIE10",
    title: "10% OFF",
    description: "Save 10% on your order, up to ₱150.",
    minimumSubtotal: 0,
    discountRate: 0.1,
    maximumDiscount: 150,
  },
  {
    code: "SAVE50",
    title: "₱50 OFF",
    description: "Take ₱50 off orders of ₱300 or more.",
    minimumSubtotal: 300,
    discountAmount: 50,
  },
  {
    code: "WELCOME15",
    title: "15% OFF",
    description: "Get 15% off orders of ₱200 or more, up to ₱100.",
    minimumSubtotal: 200,
    discountRate: 0.15,
    maximumDiscount: 100,
  },
  {
    code: "MEAL20",
    title: "20% OFF",
    description: "Save 20% on orders of ₱500 or more, up to ₱200.",
    minimumSubtotal: 500,
    discountRate: 0.2,
    maximumDiscount: 200,
  },
  {
    code: "LUNCH75",
    title: "₱75 OFF",
    description: "Take ₱75 off orders of ₱500 or more.",
    minimumSubtotal: 500,
    discountAmount: 75,
  },
  {
    code: "SNACK30",
    title: "₱30 OFF",
    description: "Take ₱30 off orders of ₱200 or more.",
    minimumSubtotal: 200,
    discountAmount: 30,
  },
  {
    code: "FAMILY15",
    title: "15% OFF",
    description: "Save 15% on orders of ₱800 or more, up to ₱200.",
    minimumSubtotal: 800,
    discountRate: 0.15,
    maximumDiscount: 200,
  },
  {
    code: "SWEET25",
    title: "₱25 OFF",
    description: "Take ₱25 off orders of ₱150 or more.",
    minimumSubtotal: 150,
    discountAmount: 25,
  },
  {
    code: "DINNER100",
    title: "₱100 OFF",
    description: "Take ₱100 off orders of ₱700 or more.",
    minimumSubtotal: 700,
    discountAmount: 100,
  },
  {
    code: "WEEKEND12",
    title: "12% OFF",
    description: "Save 12% on orders of ₱400 or more, up to ₱100.",
    minimumSubtotal: 400,
    discountRate: 0.12,
    maximumDiscount: 100,
  },
  {
    code: "FRIES20",
    title: "₱20 OFF",
    description: "Take ₱20 off orders of ₱150 or more.",
    minimumSubtotal: 150,
    discountAmount: 20,
  },
  {
    code: "BUNDLE80",
    title: "₱80 OFF",
    description: "Take ₱80 off orders of ₱600 or more.",
    minimumSubtotal: 600,
    discountAmount: 80,
  },
  {
    code: "BIGORDER20",
    title: "20% OFF",
    description: "Save 20% on orders of ₱1,000 or more, up to ₱250.",
    minimumSubtotal: 1000,
    discountRate: 0.2,
    maximumDiscount: 250,
  },
];

export function getPromoDiscount(promo, subtotal) {
  if (!promo || subtotal < promo.minimumSubtotal) return 0;

  if (promo.discountAmount) {
    return Math.min(subtotal, promo.discountAmount);
  }

  return Math.min(
    subtotal,
    Math.round(subtotal * promo.discountRate),
    promo.maximumDiscount,
  );
}
