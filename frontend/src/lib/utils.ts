import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMeanReversionDescription(mri: number) {
  if (mri > 0.7) {
    return [
      "Strong Mean Reversion (0.7 - 1.0)",
      "Price frequently crosses back over the moving average",
      "Shows strong tendency to return to average price",
      "Low Hurst exponent (< 0.4)",
      "Trading implication: Good for mean reversion strategies (buy low, sell high around the average)",
    ];
  } else if (mri > 0.5) {
    return [
      "Moderate Mean Reversion (0.5 - 0.7)",
      "Some tendency to revert to the mean",
      "Moderate price oscillations",
      "Trading implication: Mild mean reversion opportunities",
    ];
  } else if (mri >= 0.3) {
    return [
      "Random Walk (0.3 - 0.5)",
      "No clear pattern",
      "Price movements are unpredictable",
      "Hurst exponent near 0.5",
      "Trading implication: Difficult to predict, avoid directional bets",
    ];
  } else {
    return [
      "Trending/Momentum (0.0 - 0.3)",
      "Price shows persistent directional movement",
      "Few crossings of the moving average",
      "High Hurst exponent (> 0.6)",
      "Trading implication: Good for momentum/trend-following strategies (ride the trend)",
    ];
  }
}

export function getVolatilityDescription(volatility: number) {
  if (volatility < 0.2) {
    return [
      "Very Low Volatility (< 20%)",
      "Price is very stable with minimal fluctuations",
      "Low risk, low reward potential",
      "Typical for stablecoins or highly liquid pairs with minimal movement",
      "Trading implication: Tight spreads, good for high-frequency arbitrage, market making",
    ];
  } else if (volatility < 0.4) {
    return [
      "Low Volatility (20-40%)",
      "Price shows moderate stability",
      "Lower risk environment",
      "Typical for major crypto pairs during calm market conditions",
      "Trading implication: Suitable for conservative strategies, range trading",
    ];
  } else if (volatility < 0.6) {
    return [
      "Moderate Volatility (40-60%)",
      "Normal volatility for crypto markets",
      "Balanced risk/reward",
      "Typical for ETH/USD, BTC/USD during regular market conditions",
      "Trading implication: Standard trading strategies apply, good for swing trading",
    ];
  } else if (volatility < 0.8) {
    return [
      "High Volatility (60-80%)",
      "Significant price swings",
      "Higher risk and reward potential",
      "Common during trending markets or news events",
      "Trading implication: Wider stops needed, good for breakout strategies, higher risk",
    ];
  } else if (volatility < 1.0) {
    return [
      "Very High Volatility (80-100%)",
      "Large price movements and uncertainty",
      "High risk environment",
      "Occurs during major market events or altcoin pumps",
      "Trading implication: Position sizing should be reduced, expect sharp reversals",
    ];
  } else {
    return [
      "Extreme Volatility (> 100%)",
      "Exceptional price instability",
      "Very high risk",
      "Rare for major pairs, common in low-liquidity or meme tokens",
      "Trading implication: Extreme caution, potential for liquidations, consider avoiding",
    ];
  }
}
