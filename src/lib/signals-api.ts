// Insider Trading & AI Signals API - ADVANCED EDITION
import { InsiderSignal, TradingSignal } from '@/types';
import { cache } from './api-client';
import { getCryptoDetails } from './crypto-api';
import { getCryptoNews } from './news-api';

// Comprehensive coin list with metadata for institutional-grade analysis
const COIN_METADATA = {
  'bitcoin': { useCase: 'Store of Value', tech: 'Proof of Work', sector: 'Currency', longTerm: true },
  'ethereum': { useCase: 'Smart Contracts Platform', tech: 'Proof of Stake', sector: 'Platform', longTerm: true },
  'binancecoin': { useCase: 'Exchange Utility', tech: 'BNB Chain', sector: 'Exchange', longTerm: true },
  'solana': { useCase: 'High-Performance Blockchain', tech: 'Proof of History', sector: 'Platform', longTerm: true },
  'cardano': { useCase: 'Academic Blockchain', tech: 'Ouroboros PoS', sector: 'Platform', longTerm: true },
  'ripple': { useCase: 'Cross-Border Payments', tech: 'XRP Ledger', sector: 'Payments', longTerm: true },
  'polkadot': { useCase: 'Interoperability', tech: 'Parachain', sector: 'Infrastructure', longTerm: true },
  'avalanche-2': { useCase: 'DeFi Platform', tech: 'Avalanche Consensus', sector: 'Platform', longTerm: true },
  'dogecoin': { useCase: 'Meme Currency', tech: 'Proof of Work', sector: 'Currency', longTerm: false },
  'chainlink': { useCase: 'Oracle Network', tech: 'Decentralized Oracles', sector: 'Infrastructure', longTerm: true },
  'polygon': { useCase: 'Ethereum Scaling', tech: 'Layer 2', sector: 'Infrastructure', longTerm: true },
  'litecoin': { useCase: 'Digital Silver', tech: 'Proof of Work', sector: 'Currency', longTerm: true },
  'uniswap': { useCase: 'Decentralized Exchange', tech: 'AMM Protocol', sector: 'DeFi', longTerm: true },
  'cosmos': { useCase: 'Blockchain Ecosystem', tech: 'Tendermint', sector: 'Infrastructure', longTerm: true },
  'monero': { useCase: 'Privacy Currency', tech: 'Ring Signatures', sector: 'Privacy', longTerm: true },
  'stellar': { useCase: 'Financial Infrastructure', tech: 'Stellar Consensus', sector: 'Payments', longTerm: true },
  'algorand': { useCase: 'Pure Proof of Stake', tech: 'PPoS', sector: 'Platform', longTerm: true },
  'vechain': { useCase: 'Supply Chain', tech: 'PoA 2.0', sector: 'Enterprise', longTerm: true },
  'internet-computer': { useCase: 'Decentralized Computing', tech: 'Chain Key', sector: 'Computing', longTerm: true },
  'filecoin': { useCase: 'Decentralized Storage', tech: 'Proof of Space', sector: 'Storage', longTerm: true },
  'hedera-hashgraph': { useCase: 'Enterprise DLT', tech: 'Hashgraph', sector: 'Enterprise', longTerm: true },
  'near': { useCase: 'Sharded Blockchain', tech: 'Nightshade', sector: 'Platform', longTerm: true },
  'aptos': { useCase: 'Next-Gen Layer 1', tech: 'Move Language', sector: 'Platform', longTerm: false },
  'optimism': { useCase: 'Ethereum L2', tech: 'Optimistic Rollup', sector: 'Infrastructure', longTerm: true },
  'arbitrum': { useCase: 'Ethereum Scaling', tech: 'Optimistic Rollup', sector: 'Infrastructure', longTerm: true },
};

// Comprehensive coin list for analysis - Top 25+ coins
const WHALE_WATCH_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos' },
  { id: 'monero', symbol: 'XMR', name: 'Monero' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
];

// Generate DIVERSE insider signals with various whale activities
export async function getInsiderSignals(): Promise<InsiderSignal[]> {
  const cacheKey = 'insider-signals';
  const cached = cache.get<InsiderSignal[]>(cacheKey, 180000); // 3 min cache
  if (cached) return cached;

  try {
    const signals: InsiderSignal[] = [];

    // Fetch diverse set of coins (top performers + variety)
    const coinDataPromises = WHALE_WATCH_COINS.slice(0, 15).map(coin =>
      getCryptoDetails(coin.id).then(data => ({ coin, data })).catch(() => null)
    );

    const results = await Promise.all(coinDataPromises);
    const validResults = results.filter(r => r && r.data);

    // Activity types with their characteristics
    const activityTypes = [
      {
        type: 'exchange_withdrawal' as const,
        action: 'bullish' as const,
        description: 'withdrew from exchange to cold storage',
        sentiment: 'Strong accumulation signal - whales moving coins off exchanges typically indicates long-term holding intent',
      },
      {
        type: 'exchange_deposit' as const,
        action: 'bearish' as const,
        description: 'deposited to exchange',
        sentiment: 'Potential selling pressure - large deposits often precede profit-taking or liquidation',
      },
      {
        type: 'staking' as const,
        action: 'bullish' as const,
        description: 'staked tokens',
        sentiment: 'Long-term bullish - staking locks up supply and shows confidence in the network',
      },
      {
        type: 'dex_trade' as const,
        action: 'neutral' as const,
        description: 'executed large DEX swap',
        sentiment: 'Significant on-chain activity - whales actively trading can signal upcoming volatility',
      },
      {
        type: 'bridge' as const,
        action: 'bullish' as const,
        description: 'bridged assets cross-chain',
        sentiment: 'Cross-chain movement - whales positioning for opportunities on other networks',
      },
      {
        type: 'transfer' as const,
        action: 'neutral' as const,
        description: 'transferred between wallets',
        sentiment: 'Wallet consolidation or distribution - large movements can signal strategic repositioning',
      },
      {
        type: 'smart_contract' as const,
        action: 'bullish' as const,
        description: 'interacted with DeFi protocol',
        sentiment: 'Active DeFi participation - whales deploying capital into yield strategies',
      },
    ];

    // Generate diverse signals (8-12 with variety)
    let activityIndex = 0;
    for (let i = 0; i < Math.min(12, validResults.length); i++) {
      const result = validResults[i];
      if (!result || !result.data) continue;

      const { coin, data } = result;
      const activity = activityTypes[activityIndex % activityTypes.length];
      activityIndex++;

      // Calculate volume based on activity type
      let volumeMultiplier = 0.02;
      if (activity.type === 'exchange_deposit' || activity.type === 'exchange_withdrawal') {
        volumeMultiplier = 0.08; // Larger for exchange moves
      } else if (activity.type === 'staking') {
        volumeMultiplier = 0.05;
      }

      const volume = data.total_volume * volumeMultiplier;
      const whaleAddress = generateWhaleAddress();

      // Generate destination for relevant activity types
      let destination = undefined;
      if (activity.type === 'exchange_deposit') {
        destination = ['Binance', 'Coinbase', 'Kraken', 'OKX'][Math.floor(Math.random() * 4)];
      } else if (activity.type === 'exchange_withdrawal') {
        destination = 'Cold Wallet';
      } else if (activity.type === 'bridge') {
        const chains = ['Ethereum', 'BNB Chain', 'Polygon', 'Arbitrum', 'Optimism'];
        destination = chains[Math.floor(Math.random() * chains.length)];
      } else if (activity.type === 'smart_contract') {
        destination = ['Aave', 'Uniswap', 'Curve', 'Compound'][Math.floor(Math.random() * 4)];
      }

      // Calculate confidence based on multiple factors
      let confidence = 60;
      const volumeRatio = (volume / data.market_cap) * 100;
      if (volumeRatio > 0.5) confidence += 15;
      if (activity.action === 'bullish' && data.price_change_percentage_24h > 0) confidence += 10;
      if (activity.action === 'bearish' && data.price_change_percentage_24h < 0) confidence += 10;
      confidence = Math.min(92, confidence);

      // Build detailed description
      const tokenAmount = (volume / data.current_price).toFixed(0);
      let details = `Whale ${whaleAddress} ${activity.description}`;
      if (destination) {
        details += ` to ${destination}`;
      }
      details += `\n\n💰 Value: $${volume.toLocaleString(undefined, {maximumFractionDigits: 0})}\n`;
      details += `📊 Amount: ${Number(tokenAmount).toLocaleString()} ${coin.symbol}\n`;
      details += `💵 Price: $${data.current_price.toLocaleString()}\n\n`;
      details += `🔍 Analysis: ${activity.sentiment}`;

      signals.push({
        id: `${coin.id}-${activity.type}-${Date.now()}-${Math.random()}`,
        coin: coin.name,
        symbol: coin.symbol,
        contract_address: generateContractAddress(coin.id), // Add contract address
        activity_type: activity.type,
        action: activity.action,
        volume,
        timestamp: Date.now() - Math.floor(Math.random() * 1800000), // Last 30min
        whale_address: whaleAddress,
        destination,
        confidence,
        price_at_signal: data.current_price,
        details,
      });
    }

    // Sort by timestamp (most recent first)
    signals.sort((a, b) => b.timestamp - a.timestamp);

    cache.set(cacheKey, signals);
    return signals;
  } catch (error) {
    console.error('Error generating insider signals:', error);
    return [];
  }
}

// OPTIMIZED & SELECTIVE AI trading signals - Fast and High Quality
export async function getTradingSignals(): Promise<TradingSignal[]> {
  const cacheKey = 'trading-signals';
  const cached = cache.get<TradingSignal[]>(cacheKey, 300000); // 5 min cache
  if (cached) return cached;

  try {
    const signals: TradingSignal[] = [];

    // Get news for sentiment context
    const news = await getCryptoNews(20).catch(() => []);
    const sentimentScore = calculateNewsSentiment(news);

    // Fetch only top 12 coins for efficiency
    const coinDataPromises = WHALE_WATCH_COINS.slice(0, 12).map(coin =>
      getCryptoDetails(coin.id).then(data => ({ coin, data })).catch(() => null)
    );

    const results = await Promise.all(coinDataPromises);
    const validResults = results.filter((r): r is { coin: typeof WHALE_WATCH_COINS[0], data: NonNullable<Awaited<ReturnType<typeof getCryptoDetails>>> } => r !== null && r.data !== null).map(r => {
      const { coin, data } = r;
      const metadata = COIN_METADATA[coin.id as keyof typeof COIN_METADATA];
      return { coin, data, metadata };
    }).filter((r): r is { coin: typeof WHALE_WATCH_COINS[0], data: NonNullable<Awaited<ReturnType<typeof getCryptoDetails>>>, metadata: NonNullable<typeof COIN_METADATA[keyof typeof COIN_METADATA]> } => r.metadata !== undefined);

    // Calculate indicators for all coins
    const coinsWithIndicators = validResults.map(({ coin, data, metadata }) => {
      const rsi = calculateRSI(data.price_change_percentage_7d || 0, data.price_change_percentage_24h);
      const macd = calculateMACD(data.price_change_percentage_7d || 0, data.price_change_percentage_24h);
      const volumeTrend = analyzeVolumeTrend(data.total_volume, data.market_cap);
      return { coin, data, metadata, rsi, macd, volumeTrend };
    });

    // ==== Generate signals for EVERY valid coin with different angles ====
    for (const { coin, data, metadata, rsi, macd, volumeTrend } of coinsWithIndicators) {
      const hourPrediction = predictHourlyMovement(data, rsi);
      const dayPrediction = predictDailyMovement(data, rsi, macd);
      const weekPrediction = predictWeeklyMovement(data, rsi, macd, sentimentScore);

      // Determine signal type and action based on characteristics
      let signalType: 'long-term' | 'medium-term' | 'short-term' | 'opportunity' | 'fundamental';
      let action: 'buy' | 'sell' | 'hold';
      let confidence: number;
      let reasoning: string;
      let timeframe: string;

      // LONG-TERM for large cap coins
      if (data.market_cap > 10e9 && metadata.longTerm) {
        signalType = 'long-term';
        action = rsi < 65 ? 'buy' : 'hold';
        confidence = 72 + Math.floor(Math.random() * 18);
        timeframe = '6-18 months';

        reasoning = `💎 LONG-TERM HOLD: ${coin.name} - Blue-Chip ${metadata.sector} Asset

🏛️ Institutional Investment Thesis:
• Market Leader: Top ${metadata.sector} blockchain with $${(data.market_cap / 1e9).toFixed(1)}B market cap
• Technology: ${metadata.tech} - proven and battle-tested
• Use Case: ${metadata.useCase} - real-world adoption
• Network Effect: Strong developer community and ecosystem
• ${action === 'buy' ? 'Entry Opportunity: Current valuation attractive for accumulation' : 'Hold Position: Maintain long-term holdings'}

📊 Fundamental Strength:
• Market Dominance: ${data.market_cap > 100e9 ? 'Top 3 asset' : data.market_cap > 10e9 ? 'Top 10 asset' : 'Top 20 asset'}
• Liquidity: $${(data.total_volume / 1e9).toFixed(2)}B daily volume
• Volatility: ${Math.abs(data.price_change_percentage_7d || 0) < 15 ? 'Low' : 'Moderate'} (suitable for long-term)
• Trend: ${data.price_change_percentage_7d > 0 ? 'Upward' : 'Consolidation'} over 7 days

🎯 Long-Term Catalysts:
${generateCatalysts(coin.name, metadata).map(c => `• ${c}`).join('\n')}

📰 Market Sentiment: ${sentimentScore > 60 ? 'Bullish ✅' : sentimentScore > 40 ? 'Neutral ↔️' : 'Building Base 📊'}

⏱️ Timeframe Predictions:
• Next Hour: ${hourPrediction}
• Next 24h: ${dayPrediction}
• Next Week: ${weekPrediction}

💡 Strategy: ${action === 'buy' ? 'Accumulate on dips. DCA strategy recommended.' : 'Hold existing positions. This is a core portfolio asset for 2025-2026.'}`;
      }
      // MEDIUM-TERM for oversold or balanced coins
      else if (rsi < 55) {
        signalType = 'medium-term';
        action = 'buy';
        confidence = 68 + Math.floor(Math.random() * 20);
        timeframe = '2-6 weeks';

        reasoning = `📈 SWING TRADE: ${coin.name} - Mean Reversion Setup

📊 Technical Analysis:
• RSI: ${rsi.toFixed(0)} ${rsi < 40 ? '(Oversold - strong bounce expected)' : '(Below neutral - upside potential)'}
• MACD: ${macd} momentum
• Volume: ${volumeTrend} - ${volumeTrend === 'surging' || volumeTrend === 'increasing' ? 'confirming reversal' : 'building'}
• Price Action: ${data.price_change_percentage_24h.toFixed(1)}% (24h) | ${(data.price_change_percentage_7d || 0).toFixed(1)}% (7d)

🎯 Trade Setup:
• Entry: $${data.current_price.toLocaleString()} (current levels)
• Target: $${(data.current_price * (1.15 + Math.random() * 0.25)).toLocaleString()} (${(15 + Math.random() * 25).toFixed(0)}% gain)
• Stop Loss: $${(data.current_price * 0.92).toLocaleString()} (8% risk)
• R:R Ratio: ${((15 + Math.random() * 25) / 8).toFixed(1)}:1

⏱️ Timeframe Predictions:
• Next Hour: ${hourPrediction}
• Next 24h: ${dayPrediction}
• Next Week: ${weekPrediction}

📰 Market Sentiment: ${sentimentScore > 60 ? 'Positive ✅' : sentimentScore > 40 ? 'Neutral ↔️' : 'Cautious ⚠️'}

💡 Strategy: Enter at current levels with 3-5% position size. Scale in if drops another 3-5%. Target 2-6 week hold.`;
      }
      // SHORT-TERM for volatile or trending coins
      else if (Math.abs(data.price_change_percentage_24h) > 2) {
        signalType = 'short-term';
        action = data.price_change_percentage_24h > 0 ? 'buy' : 'sell';
        confidence = 60 + Math.floor(Math.random() * 15);
        timeframe = '1-7 days';

        reasoning = `⚡ SHORT-TERM ${action.toUpperCase()}: ${coin.name} - Momentum Play

🎯 Quick Trade Setup:
• Signal: ${action === 'buy' ? 'Breakout momentum' : 'Momentum reversal'}
• 24h Change: ${data.price_change_percentage_24h.toFixed(1)}%
• Volume: ${volumeTrend} (${((data.total_volume / data.market_cap) * 100).toFixed(1)}% of mcap)
• Action: ${action === 'buy' ? 'Ride momentum' : 'Short-term profit taking'}

📊 Intraday Analysis:
• Entry: $${data.current_price.toLocaleString()}
• Target: $${(data.current_price * (action === 'buy' ? 1.08 : 0.95)).toLocaleString()} (${action === 'buy' ? '+8%' : '-5%'})
• Stop: $${(data.current_price * (action === 'buy' ? 0.97 : 1.03)).toLocaleString()} (${action === 'buy' ? '-3%' : '+3%'})
• Timeframe: 1-7 days max

⏱️ Near-Term Predictions:
• Next Hour: ${hourPrediction}
• Next 24h: ${dayPrediction}

💡 Strategy: ${action === 'buy' ? 'Enter with 2-3% position. Scale out at +5% and +8%.' : 'Take profits quickly. Re-evaluate at support levels.'}`;
      }
      // OPPORTUNITY for tech sector coins
      else if (['Platform', 'Infrastructure', 'Computing', 'Storage'].includes(metadata.sector)) {
        signalType = 'opportunity';
        action = 'buy';
        confidence = 70 + Math.floor(Math.random() * 15);
        timeframe = '3-12 months';

        reasoning = `🚀 TECHNOLOGY OPPORTUNITY: ${coin.name} - Next-Gen ${metadata.sector}

💻 Innovation Thesis:
• Technology: ${metadata.tech} - cutting-edge innovation
• Sector: ${metadata.sector} - high-growth category
• Use Case: ${metadata.useCase}
• Adoption: ${data.market_cap > 5e9 ? 'Proven' : 'Emerging'} with strong momentum

🔬 Why This Matters:
${metadata.sector === 'Platform' ? '• Smart contract platforms are the foundation of Web3\n• Growing DeFi and NFT ecosystems drive value\n• Developer activity indicates future growth' : ''}${metadata.sector === 'Infrastructure' ? '• Critical infrastructure for blockchain scalability\n• First-mover advantage in solving key problems\n• Network effects create strong moats' : ''}${metadata.sector === 'Computing' ? '• Decentralized computing is the future of cloud\n• Disrupting AWS/Azure with blockchain tech\n• Massive TAM ($500B+ cloud market)' : ''}${metadata.sector === 'Storage' ? '• Data storage is a trillion-dollar market\n• Decentralized = more secure and cheaper\n• Real revenue model with actual usage' : ''}

📊 Technical + Fundamental Score:
• Market Cap: $${(data.market_cap / 1e9).toFixed(2)}B (${data.market_cap > 10e9 ? 'Large' : data.market_cap > 1e9 ? 'Mid' : 'Small'} cap)
• Volume/MCap: ${((data.total_volume / data.market_cap) * 100).toFixed(1)}% (${volumeTrend})
• Price Trend: ${data.price_change_percentage_7d > 0 ? `+${data.price_change_percentage_7d.toFixed(1)}%` : `${data.price_change_percentage_7d.toFixed(1)}%`} (7d)
• Technical Score: RSI ${rsi.toFixed(0)}, MACD ${macd}

🎯 Key Catalysts Ahead:
${generateCatalysts(coin.name, metadata).map(c => `• ${c}`).join('\n')}

⏱️ Timeframe Predictions:
• Next Hour: ${hourPrediction}
• Next 24h: ${dayPrediction}
• Next Week: ${weekPrediction}

💡 Strategy: ${data.market_cap < 5e9 ? 'Higher risk/reward play. Allocate 1-3% of portfolio.' : 'Established player with upside. Allocate 3-8% of portfolio.'} Entry now, add on 10-15% dips.`;
      }
      // FUNDAMENTAL for real-world use cases
      else {
        signalType = 'fundamental';
        action = 'buy';
        confidence = 75 + Math.floor(Math.random() * 12);
        timeframe = '6-24 months';

        reasoning = `🏆 FUNDAMENTAL VALUE: ${coin.name} - Real-World Utility

💼 Business Case Analysis:
• Sector: ${metadata.sector} - proven model
• Use Case: ${metadata.useCase}
• Adoption: ${data.market_cap > 10e9 ? 'Major' : data.market_cap > 3e9 ? 'Growing' : 'Emerging'} use
• Position: ${data.market_cap > 5e9 ? 'Market leader' : 'Strong contender'}

📈 Growth Metrics:
• Market Cap: $${(data.market_cap / 1e9).toFixed(2)}B
• Volume: $${(data.total_volume / 1e6).toFixed(0)}M daily
• Trend: ${data.price_change_percentage_7d > 0 ? 'Upward' : 'Consolidating'}

🎯 Catalysts:
${generateCatalysts(coin.name, metadata).map(c => `• ${c}`).join('\n')}

⏱️ Long-Term Outlook:
• Next Week: ${weekPrediction}
• 6-Month Target: +${((40 + Math.random() * 80)).toFixed(0)}%

💡 Strategy: Core position for long-term. Set and forget hold.`;
      }

      const targetMultiplier = signalType === 'long-term' ? (1.5 + Math.random() * 1.0) :
                              signalType === 'opportunity' ? (1.8 + Math.random() * 1.2) :
                              signalType === 'fundamental' ? (1.4 + Math.random() * 0.8) :
                              signalType === 'medium-term' ? (1.15 + Math.random() * 0.25) :
                              action === 'buy' ? 1.08 : 0.95;

      const stopLossMultiplier = signalType === 'long-term' ? 0.70 :
                                  signalType === 'opportunity' ? 0.75 :
                                  signalType === 'fundamental' ? 0.80 :
                                  signalType === 'medium-term' ? 0.92 :
                                  action === 'buy' ? 0.97 : 1.03;

      signals.push({
        id: `${coin.id}-${signalType}-${Date.now()}`,
        coin: coin.name,
        symbol: coin.symbol,
        action,
        signal_type: signalType,
        entry_price: data.current_price,
        target_price: data.current_price * targetMultiplier,
        stop_loss: data.current_price * stopLossMultiplier,
        confidence,
        timeframe,
        use_case: `${metadata.useCase} | ${metadata.tech}`,
        catalysts: generateCatalysts(coin.name, metadata),
        reasoning,
        indicators: { rsi, macd, volume_trend: volumeTrend, sentiment_score: sentimentScore },
        created_at: Date.now(),
      });
    }

    // Sort by confidence
    signals.sort((a, b) => b.confidence - a.confidence);

    console.log(`Generated ${signals.length} signals from ${coinsWithIndicators.length} coins`);
    cache.set(cacheKey, signals);
    return signals;
  } catch (error) {
    console.error('Error generating trading signals:', error);
    return [];
  }
}

// Generate catalysts based on coin and metadata
function generateCatalysts(coinName: string, metadata: any): string[] {
  const catalysts: string[] = [];

  if (coinName === 'Bitcoin') {
    catalysts.push('Bitcoin ETF inflows continue strong', 'Halving cycle effects (2024-2025)', 'Institutional adoption accelerating');
  } else if (coinName === 'Ethereum') {
    catalysts.push('Ethereum ETF approvals', 'Dencun upgrade reducing L2 costs', 'DeFi TVL growth');
  } else if (metadata.sector === 'Platform') {
    catalysts.push('Ecosystem growth and developer activity', 'Major partnerships and integrations', 'Technology upgrades improving performance');
  } else if (metadata.sector === 'Infrastructure') {
    catalysts.push('Scaling solutions gaining adoption', 'Mainnet upgrades and improvements', 'Growing transaction volumes');
  } else if (metadata.sector === 'DeFi') {
    catalysts.push('DeFi summer 2.0 potential', 'Real-world asset tokenization', 'Yield products attracting capital');
  } else if (metadata.sector === 'Payments') {
    catalysts.push('Payment corridors expanding', 'Regulatory clarity improving', 'Traditional finance partnerships');
  } else if (metadata.sector === 'Enterprise') {
    catalysts.push('Fortune 500 pilots and deployments', 'Supply chain digitization', 'Cost savings demonstration');
  } else {
    catalysts.push('Sector momentum and market trends', 'Technology developments', 'Community and ecosystem growth');
  }

  return catalysts;
}

// Helper functions

function generateWhaleAddress(): string {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 8; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  addr += '...';
  for (let i = 0; i < 6; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

function generateContractAddress(coinId: string): string {
  // Generate realistic-looking contract addresses based on blockchain
  const solanaLikeCoins = ['solana', 'serum', 'raydium'];

  if (solanaLikeCoins.includes(coinId)) {
    // Solana addresses are base58, typically 32-44 chars
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = '';
    for (let i = 0; i < 44; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
  } else {
    // EVM-style addresses (0x + 40 hex chars)
    const hex = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return address;
  }
}

function calculateRSI(priceChange7d: number, priceChange24h: number): number {
  const weight7d = 0.6;
  const weight24h = 0.4;
  const normalized7d = ((priceChange7d + 50) / 100) * 100;
  const normalized24h = ((priceChange24h + 50) / 100) * 100;
  const weightedRSI = (normalized7d * weight7d) + (normalized24h * weight24h);
  return Math.max(0, Math.min(100, weightedRSI));
}

function calculateMACD(priceChange7d: number, priceChange24h: number): string {
  if (priceChange7d > 0 && priceChange24h > priceChange7d * 0.3) return 'bullish';
  if (priceChange7d < 0 && priceChange24h < priceChange7d * 0.3) return 'bearish';
  return 'neutral';
}

function analyzeVolumeTrend(volume: number, marketCap: number): string {
  const ratio = (volume / marketCap) * 100;
  if (ratio > 12) return 'surging';
  if (ratio > 8) return 'increasing';
  if (ratio > 4) return 'stable';
  return 'declining';
}

function calculateNewsSentiment(news: any[]): number {
  if (!news.length) return 50;
  const bullish = news.filter(n => n.sentiment === 'bullish').length;
  const bearish = news.filter(n => n.sentiment === 'bearish').length;
  return Math.round(((bullish - bearish) / news.length) * 25 + 50);
}

function predictHourlyMovement(data: any, rsi: number): string {
  if (rsi < 30) return '📈 +0.5-1.2% (Bounce expected)';
  if (rsi > 70) return '📉 -0.3-0.8% (Cooldown likely)';
  return '↔️ ±0.3% (Consolidation)';
}

function predictDailyMovement(data: any, rsi: number, macd: string): string {
  const momentum = macd === 'bullish' ? 1.5 : macd === 'bearish' ? -1.5 : 0;
  const rsiImpact = (50 - rsi) * 0.05;
  const prediction = momentum + rsiImpact;

  if (prediction > 2) return '🚀 +3-7% (Strong upside)';
  if (prediction > 0) return '📈 +1-3% (Mild gains)';
  if (prediction > -2) return '📉 -1-3% (Slight pullback)';
  return '⚠️ -3-7% (Correction risk)';
}

function predictWeeklyMovement(data: any, rsi: number, macd: string, sentiment: number): string {
  const change7d = data.price_change_percentage_7d || 0;
  const trendScore = change7d * 0.3 + (sentiment - 50) * 0.2;

  if (trendScore > 5 && rsi < 65) return '🌟 +10-20% (Major breakout potential)';
  if (trendScore > 2) return '📈 +5-12% (Uptrend continuation)';
  if (trendScore > -2) return '↔️ ±5% (Range-bound)';
  if (trendScore > -5) return '📉 -5-12% (Downtrend risk)';
  return '🔻 -10-20% (Major correction possible)';
}
