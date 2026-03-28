import { Button } from '@/components/ui/button'

export type ResultVariant = 'success' | 'failure'

interface ResultPageProps {
  imgUrl: string
  title: string
  descriptionLine1: string
  descriptionLine2?: string
  variant?: ResultVariant
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export default function ResultPage({
  imgUrl,
  title,
  descriptionLine1,
  descriptionLine2,
  variant = 'success',
  primaryAction,
  secondaryAction,
}: ResultPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center mb-8">
          <img
            src={imgUrl}
            alt={title}
            className="max-h-64 w-auto"
          />
        </div>

        <h1
          className={`text-2xl md:text-3xl font-semibold mb-3 ${
            variant === 'success' ? 'text-slate-800' : 'text-red-600'
          }`}
        >
          {title}
        </h1>

        <p className="text-sm md:text-base text-slate-600">
          {descriptionLine1}
        </p>

        {descriptionLine2 && (
          <p className="text-sm md:text-base text-slate-600 mt-1">
            {descriptionLine2}
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {primaryAction && (
              <Button onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
