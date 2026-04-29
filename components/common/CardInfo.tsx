import { cardItems } from '@/utils/cardItems';
import { Card } from '@heroui/react';

const CardInfo = () => {
  return (
    <div className="">
      <h2 className="text-xl font-semibold  mb-2">
        Why choose <span className="text-foreground">FocusTube</span> ?
      </h2>

      <div className="flex flex-col gap-4 md:gap-6 md:py-4">
        {cardItems.map((item, index) => (
          <Card
            key={index}
            className="flex flex-row gap-4 p-2 bg-background-secondary backdrop-blur-md border border-neutral-800 w-sm"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center font-bold">
              {item.icon}
            </div>
            <div className="flex flex-col justify-center">
              <Card.Title className="text-sm text-neutral-100 font-semibold text-primary">
                {item.title}
              </Card.Title>
              <Card.Description className="text-xs text-neutral-400">
                {item.description}
              </Card.Description>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardInfo;
